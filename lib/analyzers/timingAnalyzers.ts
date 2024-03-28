import Fraction from "fraction.js";
import { canonicalBpm } from "./computeCanonicalChart";
import { SPECIAL_BPMS } from "../../constants/specialBpms";

export const doffsetToTime = (offset: Fraction, bpm: Fraction) => offset.mul(4).div(bpm).mul(60);
export const dtimeToOffset = (sec: Fraction, bpm: Fraction) => bpm.mul(sec).div(60).div(4);
export const doffsetNumToTime = (offset: number, bpm: number) => offset * 4 * 60 / bpm;
export const dtimeNumToOffset = (sec: number, bpm: number) => sec * bpm / 60 / 4;

// Quantize offset to either 12th or 16th.
const _quantizeOS = (value: Fraction, conservative?: boolean) => {
  const twentyFourth = value.roundTo(conservative ? "1/24" : "1/12");
  const thirtySecond = value.roundTo(conservative ? "1/32" : "1/16");
  const diffTF = twentyFourth.sub(value).abs();
  const diffTS = thirtySecond.sub(value).abs();
  if (diffTF.compare(diffTS) <= 0) {
    return twentyFourth;
  } else {
    return thirtySecond;
  }
};

const QUANTIZATION_THRESHOLD = new Fraction(2, 60); // 2f in 60fps
const _fixStopDuration = (
  duration: Fraction,
  bpm1: Fraction,
  bpm2?: Fraction,
  _conservative?: boolean,
): [Fraction, { stopBpm: Fraction, stopDuration: string }] => {
  const [cBpm1, bpmMult1] = canonicalBpm(bpm1);
  const offset1 = dtimeToOffset(duration, cBpm1);
  const qOfs1 = _quantizeOS(offset1, _conservative).div(bpmMult1);
  const qTime1 = doffsetToTime(qOfs1, bpm1);
  const qErr1 = qTime1.sub(duration).abs();
  const accepted1 = qErr1.compare(QUANTIZATION_THRESHOLD) <= 0;

  if (!bpm2) {
    if (!accepted1) {
      if (!_conservative) {
        return _fixStopDuration(duration, bpm1, bpm2, true);
      }
      throw new Error(
        `Cannot quantize offset\n`
        + `${offset1.toFraction()} -> ${qOfs1.toFraction()} | ${qErr1.mul(60)}f @${bpm1}\n`
      );
    }
    return [qTime1, { stopBpm: bpm1, stopDuration: qOfs1.toFraction(true) }];
  } else {
    const [cBpm2, bpmMult2] = canonicalBpm(bpm2);
    const offset2 = dtimeToOffset(duration, cBpm2);
    const qOfs2 = _quantizeOS(offset2, _conservative).div(bpmMult2);
    const qTime2 = doffsetToTime(qOfs2, bpm2);
    const qErr2 = qTime2.sub(duration).abs();
    const accepted2 = qErr2.compare(QUANTIZATION_THRESHOLD) <= 0;

    if (accepted1 && !accepted2) {
      return [qTime1, { stopBpm: bpm1, stopDuration: qOfs1.toFraction(true) }];
    } else if (!accepted1 && accepted2) {
      return [qTime2, { stopBpm: bpm2, stopDuration: qOfs2.toFraction(true) }];
    } else if (accepted1 && accepted2) {
      console.log(
        `WARNING: Both 2 quantization candidates are accepted:\n`
        + `${offset1.toFraction()} -> ${qOfs1.toFraction()} | ${qErr1.mul(60)}f @${bpm1}\n`
        + `${offset2.toFraction()} -> ${qOfs2.toFraction()} | ${qErr2.mul(60)}f @${bpm2}\n`
      );
      if (qOfs1.d < qOfs2.d) {
        return [qTime1, { stopBpm: bpm1, stopDuration: qOfs1.toFraction(true) }];
      } else {
        return [qTime2, { stopBpm: bpm2, stopDuration: qOfs2.toFraction(true) }];
      }
    } else {
      if (!_conservative) {
        return _fixStopDuration(duration, bpm1, bpm2, true);
      }
      throw new Error(
        `Cannot quantize offset\n`
        + `${offset1.toFraction()} -> ${qOfs1.toFraction()} | ${qErr1.mul(60)}f @${bpm1}\n`
        + `${offset2.toFraction()} -> ${qOfs2.toFraction()} | ${qErr2.mul(60)}f @${bpm2}\n`
      );
    }
  }
};

// Align all stops and bpm-changes into a single timeline.
// All timeline events will have both offset and timing value.
// Stops are represented by bpm-changes to zero.
export const extractBpmEvents =
  (songId: string, difficulty: Difficulty, chart: Stepchart): BpmEvent<Fraction>[] => {
    const bpmEvents = [
      ...chart.bpm.map((b) => (
        { offset: b.startOffset, bpm: b.bpm }
      )),
      ...chart.stops.map((s) => (
        { offset: s.offset, stop: s.duration }
      )),
    ].sort((a, b) => (
      a.offset - b.offset
    ));

    const specialBpms = SPECIAL_BPMS[songId]?.[difficulty];

    while (!('bpm' in bpmEvents[0])) {
      bpmEvents.shift();
    }

    const timeline: BpmEvent<Fraction>[] = [{
      time: new Fraction(0),
      offset: new Fraction(0),
      // @ts-ignore `bpm` can be undefined in type-level, but it's always defined in the real data
      bpm: bpmEvents.shift().bpm,
    }];

    for (let i = 0; i < bpmEvents.length; i++) {
      const e = bpmEvents[i]!;
      const next = bpmEvents[i + 1];
      const lastBpm = timeline[0].bpm;
      const dt = doffsetToTime(e.offset.sub(timeline[0].offset), lastBpm);
      const time = dt.add(timeline[0].time);
      const baseEntry = { offset: e.offset };
      if (next && e.offset === next.offset) {
        // stop and bpm-shift at the same time
        const stopEvent  = 'stop' in e ? e : 'stop' in next ? next : null;
        const shiftEvent = 'bpm'  in e ? e : 'bpm'  in next ? next : null;
        if (!stopEvent || !shiftEvent) {
          throw new Error("Unexpected: duplicated BPM events");
        }
        const [duration, stop] = specialBpms?.[i + 1] ? (
          _fixStopDuration(stopEvent.stop, new Fraction(specialBpms[i + 1]))
        ) : (
          _fixStopDuration(stopEvent.stop, lastBpm, shiftEvent.bpm)
        );
        timeline.unshift({ ...baseEntry, time,                     bpm: new Fraction(0), ...stop });
        timeline.unshift({ ...baseEntry, time: time.add(duration), bpm: shiftEvent.bpm });
        i++;
      } else if ('bpm' in e) {
        // simple bpm-shift
        timeline.unshift({ ...baseEntry, time, bpm: e.bpm });
      } else if ('stop' in e){
        // simple stop-and-go
        const [duration, stop] = specialBpms?.[i] ? (
          _fixStopDuration(e.stop, new Fraction(specialBpms[i]))
        ) : (
          _fixStopDuration(e.stop, lastBpm)
        );
        timeline.unshift({ ...baseEntry, time,                     bpm: new Fraction(0), ...stop });
        timeline.unshift({ ...baseEntry, time: time.add(duration), bpm: lastBpm });
      } else {
        throw new Error("Unexpected: BPM event is not stop nor bpm-shift");
      }
    }

    return timeline.reverse();
  };

// Generate a function that converts offset value (based on measures)
// to time value in seconds.
type Converter<T> = (input: T) => T;
export const makeOffsetToSecConverter = (bpmTimeline: BpmEvent<Fraction>[]): Converter<Fraction> => {
  let ix = 0;
  const offsetToSec = (offset: Fraction): Fraction => {
    if (offset.compare(0) <= 0) {
      ix = 0;
    }
    while (ix > 0 && offset.compare(bpmTimeline[ix].offset) <= 0) {
      ix--;
    }
    while (bpmTimeline[ix + 1] && offset.compare(bpmTimeline[ix + 1].offset) > 0) {
      ix++;
    }
    const dt = doffsetToTime(offset.sub(bpmTimeline[ix].offset), bpmTimeline[ix].bpm);
    return bpmTimeline[ix].time.add(dt);
  };
  return offsetToSec;
}

export const makeOffsetNumToSecConverter = (bpmTimeline: BpmEvent<number>[]): Converter<number> => {
  let ix = 0;
  const offsetToSec = (offset: number): number => {
    if (offset <= 0) {
      ix = 0;
    }
    while (ix > 0 && offset <= bpmTimeline[ix].offset) {
      ix--;
    }
    while (bpmTimeline[ix + 1] && offset > bpmTimeline[ix + 1].offset) {
      ix++;
    }
    const dt = doffsetNumToTime(offset - bpmTimeline[ix].offset, bpmTimeline[ix].bpm);
    return bpmTimeline[ix].time + dt;
  };
  return offsetToSec;
}

export const makeSecNumToOffsetConverter = (bpmTimeline: BpmEvent<number>[]): Converter<number> => {
  let ix = 0;
  const secToOffset = (sec: number): number => {
    if (sec <= 0) {
      ix = 0;
    }
    while (ix > 0 && sec <= bpmTimeline[ix].time) {
      ix--;
    }
    while (bpmTimeline[ix + 1] && sec > bpmTimeline[ix + 1].time) {
      ix++;
    }
    const doffset = dtimeNumToOffset(sec - bpmTimeline[ix].time, bpmTimeline[ix].bpm);
    return bpmTimeline[ix].offset + doffset;
  };
  return secToOffset;
}

export const computeArrowTimings =
  (arrows: Arrow[], bpms: BpmEvent<Fraction>[]): ArrowEvent<Fraction>[] => {
    const converter = makeOffsetToSecConverter(bpms);
    return arrows.map((arrow) => ({ ...arrow, tags: {}, time: converter(arrow.offset) }));
  };

export const computeFreezeTimings =
  (freezes: FreezeBody[], bpms: BpmEvent<Fraction>[]): FreezeEvent<Fraction>[] => {
    const converter1 = makeOffsetToSecConverter(bpms);
    const converter2 = makeOffsetToSecConverter(bpms);
    return freezes.map((freeze) => ({
      direction: freeze.direction,
      start: {
        offset: freeze.startOffset,
        time: converter1(freeze.startOffset),
      },
      end: {
        offset: freeze.endOffset,
        time: converter2(freeze.endOffset),
      }
    }));
  };

export const computeBeatTimings =
  (lastMeasure: number, bpms: BpmEvent<Fraction>[]): Timestamp<Fraction>[] => {
    const converter = makeOffsetToSecConverter(bpms);
    let offset = new Fraction(-1, 4);
    return [...Array((lastMeasure + 1) * 4)].map(() => {
      offset = offset.add(1, 4);
      return { offset, time: converter(offset) };
    });
  };
