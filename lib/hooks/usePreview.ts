import React from "react";
import { useAnimationFrame } from "./useAnimationFrame";

export const usePreview = (chart?: ChartData | null): [
  React.MutableRefObject<number>,
  boolean,
  () => void,
  () => void,
] => {
  const startTime = React.useRef<number>();
  const [playing, setPlaying] = React.useState(false);
  const offsetRef = React.useRef<number>(0);

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
      offsetRef.current = 0;
      setPlaying(true);
    }
  }, [chart, startTime, timelineIndex, offsetRef, setPlaying]);

  const stop = React.useCallback(() => {
    setPlaying(false);
  }, [setPlaying]);

  React.useEffect(() => {
    stop();
  }, [chart, stop]);

  useAnimationFrame(() => {
    if (playing && secToOffset && startTime.current) {
      offsetRef.current = secToOffset(((new Date()).getTime() - startTime.current) / 1000);
    }
  }, [playing, secToOffset, startTime, offsetRef]);

  return [offsetRef, playing, play, stop];
};
