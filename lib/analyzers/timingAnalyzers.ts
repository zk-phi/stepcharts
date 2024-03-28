import Fraction from "fraction.js";

export const doffsetToTime = (offset: Fraction, bpm: Fraction) => offset.mul(4).div(bpm).mul(60);
export const dtimeToOffset = (sec: Fraction, bpm: Fraction) => bpm.mul(sec).div(60).div(4);
export const doffsetNumToTime = (offset: number, bpm: number) => offset * 4 * 60 / bpm;
export const dtimeNumToOffset = (sec: number, bpm: number) => sec * bpm / 60 / 4;

// Quantize offset to either 24th or 32nd.
// If AGGRESSIVE is true, this function tries to quantize offset more aggressively,
// to be either 12nd or 16th.
const _quantizeOS = (value: Fraction, aggressive?: boolean) => {
  const twentyFourth = value.mul(aggressive ? 12 : 24).round().div(aggressive ? 12 : 24);
  const thirtySecond = value.mul(aggressive ? 16 : 32).round().div(aggressive ? 16 : 32);
  const diffTF = twentyFourth.sub(value).abs();
  const diffTS = thirtySecond.sub(value).abs();
  if (diffTF.compare(diffTS) <= 0) {
    return twentyFourth;
  } else {
    return thirtySecond;
  }
};

const QUANTIZATION_THRESHOLD = new Fraction(2, 60); // 2f in 60fps
const _fixStopDuration =
  (duration: Fraction, bpm1: Fraction, bpm2?: Fraction): [Fraction, Fraction] => {
    const offset1 = dtimeToOffset(duration, bpm1);
    const qOfs1 = _quantizeOS(offset1);
    const qTime1 = doffsetToTime(qOfs1, bpm1);
    const qErr1 = qTime1.sub(duration).abs();

    if (!bpm2) {
      if (qErr1.compare(QUANTIZATION_THRESHOLD) <= 0) return [qTime1, bpm1];
      throw new Error(
        `Cannot quantize offset\n`
        + `${offset1.toFraction()} -> ${qOfs1.toFraction()} | ${qErr1.mul(60)}f @${bpm1}\n`
      );
    } else {
      const offset2 = dtimeToOffset(duration, bpm2);
      const qOfs2 = _quantizeOS(offset2);
      const qTime2 = doffsetToTime(qOfs2, bpm2);
      const qErr2 = qTime2.sub(duration).abs();
      if (qErr1.compare(qErr2) <= 0) {
        if (qErr1.compare(QUANTIZATION_THRESHOLD) <= 0) return [qTime1, bpm1];
      } else {
        if (qErr2.compare(QUANTIZATION_THRESHOLD) <= 0) return [qTime2, bpm2];
      }
      throw new Error(
        `Cannot quantize offset\n`
        + `${offset1.toFraction()} -> ${qOfs1.toFraction()} | ${qErr1.mul(60)}f @${bpm1}\n`
        + `${offset2.toFraction()} -> ${qOfs2.toFraction()} | ${qErr2.mul(60)}f @${bpm2}\n`
      );
    }
  };

// Align all stops and bpm-changes into a single timeline.
// All timeline events will have both offset and timing value.
// Stops are represented by bpm-changes to zero.
export const extractBpmEvents = (chart: Stepchart): BpmEvent<Fraction>[] => {
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
    // stop and bpm-shift at the same time
    if (next && e.offset === next.offset) {
      if (('stop' in next) && ('bpm' in e)) {
        const [duration, bpmHint] = _fixStopDuration(next.stop, lastBpm, e.bpm);
        timeline.unshift({ ...baseEntry, time,                     bpm: new Fraction(0), bpmHint });
        timeline.unshift({ ...baseEntry, time: time.add(duration), bpm: e.bpm,           bpmHint });
        i++;
      } else if (('stop' in e) && ('bpm' in next)) {
        const [duration, bpmHint] = _fixStopDuration(e.stop, lastBpm, next.bpm);
        timeline.unshift({ ...baseEntry, time,                     bpm: new Fraction(0), bpmHint });
        timeline.unshift({ ...baseEntry, time: time.add(duration), bpm: next.bpm,        bpmHint });
        i++;
      } else {
        throw new Error("Unexpected: duplicated BPM events");
      }
    } else if ('bpm' in e) {
      timeline.unshift({ ...baseEntry, time, bpm: e.bpm });
    } else if ('stop' in e){
      const [duration, bpmHint] = _fixStopDuration(e.stop, lastBpm);
      timeline.unshift({ ...baseEntry, time,                     bpm: new Fraction(0), bpmHint });
      timeline.unshift({ ...baseEntry, time: time.add(duration), bpm: lastBpm,         bpmHint });
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
