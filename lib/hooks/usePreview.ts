import React from "react";
import { useAnimationFrame } from "./useAnimationFrame";

export const usePreview = (chart?: ChartData | null): [
  React.MutableRefObject<number>,
  React.MutableRefObject<number>,
  boolean,
  () => void,
  () => void,
] => {
  const startTime = React.useRef<number>();
  const [playing, setPlaying] = React.useState(false);
  const timeRef = React.useRef<number>(0);
  const offsetRef = React.useRef<number>(0);

  const lastMeasure = React.useMemo(() => (
    chart ? Math.floor(chart.arrowTimeline[chart.arrowTimeline.length - 1].offset) + 1 : 0
  ), [chart]);

  const timelineIndex = React.useRef(0);
  const secToOffset = React.useMemo(() => {
    if (!chart) return null;
    const timeline = chart.bpmTimeline;
    return (sec: number) => {
      let i;
      for (i = timelineIndex.current; timeline[i + 1] && timeline[i + 1].time < sec; i++);
      timelineIndex.current = i;
      return (sec - timeline[i].time) * timeline[i].bpm / 60 / 4 + timeline[i].offset;
    };
  }, [chart, timelineIndex]);

  const play = React.useCallback(() => {
    if (chart) {
      startTime.current = (new Date()).getTime();
      timelineIndex.current = 0;
      timeRef.current = 0;
      offsetRef.current = 0;
      setPlaying(true);
    }
  }, [chart, startTime, timelineIndex, timeRef, offsetRef, setPlaying]);

  const stop = React.useCallback(() => {
    setPlaying(false);
  }, [setPlaying]);

  React.useEffect(() => {
    stop();
  }, [chart, stop]);

  useAnimationFrame(() => {
    if (playing && secToOffset && startTime.current) {
      timeRef.current = ((new Date()).getTime() - startTime.current) / 1000;
      offsetRef.current = secToOffset(timeRef.current);
      if (offsetRef.current >= lastMeasure) {
        stop();
      }
    }
  }, [playing, secToOffset, startTime, timeRef, offsetRef, stop]);

  return [offsetRef, timeRef, playing, play, stop];
};
