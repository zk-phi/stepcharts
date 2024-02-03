import Fraction from "fraction.js";

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
    const dt = e.offset.sub(timeline[0].offset).mul(4).div(lastBpm).mul(60);
    const time = dt.add(timeline[0].time);
    // stop and bpm-shift at the same time
    const baseEntry = { offset: e.offset };
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
// to time value in seconds. Input values to the function must be ordered.
// i.e. if you convert offset value "4.5" then you no longer convert "2.0"
// with the same function instance.
type Converter = (input: Fraction) => Fraction;
export const makeOffsetToSecConverter = (bpmTimeline: BpmEvent<Fraction>[]): Converter => {
  let ix = 0;
  let lastOffset = new Fraction(0);
  const offsetToSec = (offset: Fraction): Fraction => {
    if (offset.compare(lastOffset) < 0) {
      ix = 0;
    }
    while (bpmTimeline[ix + 1] && bpmTimeline[ix + 1].offset.compare(offset) < 0) {
      ix++;
    }
    lastOffset = offset;
    const dt = offset.sub(bpmTimeline[ix].offset).mul(4).div(bpmTimeline[ix].bpm).mul(60);
    return dt.add(bpmTimeline[ix].time);
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
