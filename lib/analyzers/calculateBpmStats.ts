import type Fraction from "fraction.js";

const findMainBpm =
  (arrowTimeline: ArrowEvent<Fraction>[], bpmTimeline: BpmEvent<Fraction>[]): number => {
    const endTime = arrowTimeline[arrowTimeline.length - 1].time;

    const hist: Record<number, number> = {};
    bpmTimeline.forEach((event, i, arr) => {
      const key = event.bpm.n / event.bpm.d;
      const dt = (arr[i + 1]?.time ?? endTime).sub(event.time);
      hist[key] = (hist[key] ?? 0) + (dt.n / dt.d);
    });

    return Number(Object.entries(hist).reduce((l, r) => l[1] > r[1] ? l : r)[0]);
  };

export const calculateBpmStats =
  (arrowTimeline: ArrowEvent<Fraction>[], bpmTimeline: BpmEvent<Fraction>[]) => ({
    mainBpm: findMainBpm(arrowTimeline, bpmTimeline),
    minBpm: Math.min(...bpmTimeline.map((b) => (
      b.bpm.compare(0) <= 0 ? Infinity : b.bpm.n / b.bpm.d
    ))),
    maxBpm: Math.max(...bpmTimeline.map((b) => b.bpm.n / b.bpm.d)),
  });
