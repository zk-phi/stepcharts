import Fraction from "fraction.js";

export const doffsetToTime = (offset: Fraction, bpm: Fraction) => offset.mul(4).div(bpm).mul(60);
export const dtimeToOffset = (sec: Fraction, bpm: Fraction) => bpm.mul(sec).div(60).div(4);

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
    calib: new Fraction(0),
  }];

  for (let i = 0; i < bpmEvents.length; i++) {
    const e = bpmEvents[i]!;
    const next = bpmEvents[i + 1];
    const lastBpm = timeline[0].bpm;
    const dt = doffsetToTime(e.offset.sub(timeline[0].offset), lastBpm);
    const time = dt.add(timeline[0].time);
    const baseEntry = { offset: e.offset, calib: new Fraction(0) };
    // stop and bpm-shift at the same time
    if (next && e.offset === next.offset) {
      if (('stop' in next) && ('bpm' in e)) {
        timeline.unshift({ ...baseEntry, time,                      bpm: new Fraction(0) });
        timeline.unshift({ ...baseEntry, time: time.add(next.stop), bpm: e.bpm });
        i++;
      } else if (('stop' in e) && ('bpm' in next)) {
        timeline.unshift({ ...baseEntry, time,                   bpm: new Fraction(0) });
        timeline.unshift({ ...baseEntry, time: time.add(e.stop), bpm: next.bpm });
        i++;
      } else {
        throw new Error("Unexpected: duplicated BPM events");
      }
    } else if ('bpm' in e) {
      timeline.unshift({ ...baseEntry, time, bpm: e.bpm });
    } else if ('stop' in e){
      timeline.unshift({ ...baseEntry, time,                   bpm: new Fraction(0) });
      timeline.unshift({ ...baseEntry, time: time.add(e.stop), bpm: lastBpm });
    } else {
      throw new Error("Unexpected: BPM event is not stop nor bpm-shift");
    }
  }

  return timeline.reverse();
};

// Generate a function that converts offset value (based on measures)
// to time value in seconds.
type Converter = (input: Fraction) => Fraction;
export const makeOffsetToSecConverter = (bpmTimeline: BpmEvent<Fraction>[]): Converter => {
  let ix = 0;
  const offsetToSec = (offset: Fraction): Fraction => {
    if (offset.compare(0) === 0) {
      ix = 0;
    }
    while (ix > 0 && offset.compare(bpmTimeline[ix].offset) <= 0) {
      ix--;
    }
    while (bpmTimeline[ix + 1] && offset.compare(bpmTimeline[ix + 1].offset) > 0) {
      ix++;
    }
    const dt = doffsetToTime(offset.sub(bpmTimeline[ix].offset), bpmTimeline[ix].bpm);
    const time = bpmTimeline[ix].time.add(dt);
    return time;
  };
  return offsetToSec;
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
