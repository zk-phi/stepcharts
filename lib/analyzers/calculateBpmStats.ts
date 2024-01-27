const findMainBpm = (arrowTimeline: ArrowEvent[], bpmTimeline: BpmEvent[]) => {
  const endTime = arrowTimeline[arrowTimeline.length - 1].time;

  const hist: Record<number, number> = {};
  bpmTimeline.forEach((event, i, arr) => {
    hist[event.bpm] = (hist[event.bpm] ?? 0) + (arr[i + 1]?.time ?? endTime) - event.time;
  });

  return Number(Object.entries(hist).reduce((l, r) => l[1] > r[1] ? l : r)[0]);
};

export const calculateBpmStats = (arrowTimeline: ArrowEvent[], bpmTimeline: BpmEvent[]) => ({
  mainBpm: findMainBpm(arrowTimeline, bpmTimeline),
  minBpm: Math.min(...bpmTimeline.filter((b) => b.bpm > 0).map((b) => b.bpm)),
  maxBpm: Math.max(...bpmTimeline.map((b) => b.bpm)),
});
