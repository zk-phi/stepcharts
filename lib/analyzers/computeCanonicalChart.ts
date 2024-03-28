import Fraction from "fraction.js";
import { quantizeOS } from "../../constants/precision";
import { dtimeToOffset, doffsetToTime, determineBeat, canonicalBpm } from "../util";
import { computeBeatTimings } from "./timingAnalyzers";
import { calculateBpmStats } from "./calculateBpmStats";
import { makeSecToOffsetConverter } from "../offsetConverters";

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
      const doffset = quantizeOS(dtimeToOffset(curr.time.sub(last.time), last.bpm));
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
      const dOffset = quantizeOS(dtimeToOffset(arr.time.sub(currentBpm.time), currentBpm.bpm));
      const offset = currentBpm.offset.add(dOffset);
      canonicalArrowTimeline.push({
        direction: arr.direction,
        tags: arr.tags,
        beat: determineBeat(offset),
        time: arr.time,
        offset,
      });
    }

    const converter1 = makeSecToOffsetConverter(canonicalBpmTimeline);
    const converter2 = makeSecToOffsetConverter(canonicalBpmTimeline);
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
