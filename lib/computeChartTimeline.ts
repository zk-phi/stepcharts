type TimelineBpmEvent = {
  time: number,
  offset: number,
  bpm: number,
};

export const extractTimelineEvents = (chart: Stepchart) => {
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

  const timeline: TimelineBpmEvent[] = [{
    time: 0,
    offset: 0,
    // @ts-ignore `bpm` can be undefined in type-level but it must be defined actually
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

  return timeline;
};
