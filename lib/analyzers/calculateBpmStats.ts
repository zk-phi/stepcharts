const findMainBpm = (chart: Stepchart, bpmTimeline: BpmEvent[]) => {
  const lastOffset = chart.arrows[chart.arrows.length - 1].offset;

  const hist: Record<number, number> = {};
  bpmTimeline.forEach((event, i, arr) => {
    hist[event.bpm] = (hist[event.bpm] ?? 0) + (arr[i + 1]?.offset ?? lastOffset) - event.offset;
  });

  return Number(Object.entries(hist).reduce((l, r) => l[1] > r[1] ? l : r)[0]);
};

export const calculateBpmStats = (chart: Stepchart, bpmTimeline: BpmEvent[]) => ({
  mainBpm: findMainBpm(chart, bpmTimeline),
  minBpm: Math.min(...chart.bpm.map((b) => b.bpm)),
  maxBpm: Math.max(...chart.bpm.map((b) => b.bpm)),
});
