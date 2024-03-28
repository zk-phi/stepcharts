import Fraction from "fraction.js";
import { OFFSET_PRECISION } from "../../constants/precision";
import { dtimeToOffset, doffsetToTime } from "../util";
import { computeBeatTimings } from "./timingAnalyzers";
import { calculateBpmStats } from "./calculateBpmStats";
import { determineBeat } from "../util";

// Convert bpm to a canonical value, which is in range 120 - 240.
export const canonicalBpm = (bpm: Fraction, _multiplier?: Fraction): [Fraction, Fraction] => (
  bpm.compare(120) < 0 ? (
    canonicalBpm(bpm.mul(2), _multiplier?.mul(2) ?? new Fraction(2))
  ) : bpm.compare(240) >= 0 ? (
    canonicalBpm(bpm.div(2), _multiplier?.div(2) ?? new Fraction(1, 2))
  ) : (
    [bpm, _multiplier ?? new Fraction(1)]
  )
);

const _quantizeOS = (value: Fraction, aggressive?: boolean) => {
  return value.mul(OFFSET_PRECISION).round().div(OFFSET_PRECISION);
};

type Converter = (input: Fraction) => Fraction;
const _makeSecToOffsetConverter = (bpmTimeline: BpmEvent<Fraction>[]): Converter => {
  let ix = 0;
  const secToOffset = (sec: Fraction): Fraction => {
    if (sec.compare(0) <= 0) {
      ix = 0;
    }
    while (ix > 0 && sec.compare(bpmTimeline[ix].time) <= 0) {
      ix--;
    }
    while (bpmTimeline[ix + 1] && sec.compare(bpmTimeline[ix + 1].time) > 0) {
      ix++;
    }
    const dOffset = dtimeToOffset(sec.sub(bpmTimeline[ix].time), bpmTimeline[ix].bpm);
    return _quantizeOS(bpmTimeline[ix].offset.add(dOffset));
  };
  return secToOffset;
}

// Canonicalize a stepchart, by canonicalizing its bpms, and by removing its all stops.
// This removes all VISUAL gimmicks from the chart (like bpm-shift from 200 to 400).
// Note that real bpm-shifts (like 130 -> 150) are NOT removed here.
export const computeCanonicalChart =
  (songId: string, chart: AnalyzedStepchart<Fraction>): AnalyzedStepchart<Fraction> => {
    const { arrowTimeline: arrows, freezeTimeline: freezes, bpmTimeline: bpms } = chart;

    const canonicalArrowTimeline: ArrowEvent<Fraction>[] = [];
    const canonicalBpmTimeline: BpmEvent<Fraction>[] = [{
      time: new Fraction(0),
      offset: new Fraction(0),
      bpm: canonicalBpm(bpms[0].bpm)[0],
    }];

    // canonicalize chart.bpmTimeline[bi] and push to canonicalBpmTimeline.
    const _canonicalizeBpmEvent = (bi: number) => {
      const last = canonicalBpmTimeline[canonicalBpmTimeline.length - 1];
      const curr = bpms[bi];
      const doffset = _quantizeOS(dtimeToOffset(curr.time.sub(last.time), last.bpm));
      const offset = last.offset.add(doffset);
      const [cBpm] = canonicalBpm(curr.bpm.equals(0) ? curr.stopBpm! : curr.bpm);
      canonicalBpmTimeline.push({ bpm: cBpm, time: curr.time, offset });
    };

    // canonicalize arrow events and bpm events
    let bi = 0;
    for (let ai = 0; ai < chart.arrowTimeline.length; ai++) {
      // if arrow.offset > nextBpmEvent.offset, fetch (and canonicalize) next bpm event
      while (bpms[bi + 1] && arrows[ai].offset.compare(bpms[bi + 1].offset) > 0)  {
        _canonicalizeBpmEvent(bi + 1);
        bi++;
      }
      const currentBpm = canonicalBpmTimeline[canonicalBpmTimeline.length - 1];
      const arr = arrows[ai];
      const dOffset = _quantizeOS(dtimeToOffset(arr.time.sub(currentBpm.time), currentBpm.bpm));
      const offset = currentBpm.offset.add(dOffset);
      canonicalArrowTimeline.push({
        direction: arr.direction,
        tags: arr.tags,
        beat: determineBeat(offset),
        time: arr.time,
        offset,
      });
    }

    const converter1 = _makeSecToOffsetConverter(canonicalBpmTimeline);
    const converter2 = _makeSecToOffsetConverter(canonicalBpmTimeline);
    const canonicalFreezeTimeline = freezes.map((f) => ({
      ...f,
      start: {
        time: f.start.time,
        offset: converter1(f.start.time),
      },
      end: {
        time: f.end.time,
        offset: converter2(f.end.time),
      },
    }));

    const lastArrowOffset = canonicalArrowTimeline[canonicalArrowTimeline.length - 1].offset;
    const lastMeasure = Math.floor(lastArrowOffset.n / lastArrowOffset.d);
    const canonicalBeatTimeline = computeBeatTimings(lastMeasure, canonicalBpmTimeline);

    return {
      bpmTimeline: canonicalBpmTimeline,
      arrowTimeline: canonicalArrowTimeline,
      freezeTimeline: canonicalFreezeTimeline,
      beatTimeline: canonicalBeatTimeline,
      ...calculateBpmStats(canonicalArrowTimeline, canonicalBpmTimeline),
    };
  };
