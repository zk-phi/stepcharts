import { extractTimelineEvents, TimelineBpmEvent } from "./computeChartTimeline";

export const findMainBpm = (chart: Stepchart) => {
  const timeline = extractTimelineEvents(chart);
  const lastOffset = chart.arrows[chart.arrows.length - 1].offset;

  const hist: Record<number, number> = {};
  timeline.forEach((event, i, arr) => {
    hist[event.bpm] = (hist[event.bpm] ?? 0) + (arr[i + 1]?.offset ?? lastOffset) - event.offset;
  });

  return Number(Object.entries(hist).reduce((l, r) => l[1] > r[1] ? l : r)[0]);
};
