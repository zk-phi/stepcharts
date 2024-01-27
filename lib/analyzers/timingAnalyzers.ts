// Align all stops and bpm-changes into a single timeline.
// All timeline events will have both offset and timing value.
// Stops are represented by bpm-changes to zero.
export const extractBpmEvents = (chart: Stepchart): BpmEvent[] => {
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

  const timeline: BpmEvent[] = [{
    time: 0,
    offset: 0,
    // @ts-ignore `bpm` can be undefined in type-level, but it's always defined in the real data
    bpm: bpmEvents.shift().bpm,
  }];

  bpmEvents.forEach((e) => {
    const lastBpm = timeline[0].bpm;
    const dt = (e.offset - timeline[0].offset) * 4 / lastBpm * 60;
    const time = timeline[0].time + dt;
    if ('bpm' in e) {
      timeline.unshift({ time, offset: e.offset, bpm: e.bpm });
    } else {
      timeline.unshift({ time,                offset: e.offset, bpm: 0 });
      timeline.unshift({ time: time + e.stop, offset: e.offset, bpm: lastBpm });
    }
  });

  return timeline.reverse();
};

// Generate a function that converts offset value (based on measures)
// to time value in seconds. Input values to the function must be ordered.
// i.e. if you convert offset value "4.5" then you no longer convert "2.0"
// with the same function instance.
type Converter = (input: number) => number;
export const makeOffsetToSecConverter = (bpmTimeline: BpmEvent[]): Converter => {
  let ix = 0;
  let lastOffset = 0;
  const offsetToSec = (offset: number): number => {
    if (offset < lastOffset) {
      ix = 0;
    }
    while (bpmTimeline[ix + 1] && bpmTimeline[ix + 1].offset < offset) {
      ix++;
    }
    return bpmTimeline[ix].time + (
      (offset - bpmTimeline[ix].offset) * 4 / bpmTimeline[ix].bpm * 60
    );
  };
  return offsetToSec;
}
