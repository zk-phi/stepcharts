import React from "react";
import { extractTimelineEvents, TimelineBpmEvent } from "../computeChartTimeline";

const useAnimationFrame = (callback = () => {}) => {
  const reqIdRef = React.useRef<number>();

  React.useEffect(() => {
    const loop = () => {
      reqIdRef.current = requestAnimationFrame(loop);
      callback();
    };
    reqIdRef.current = requestAnimationFrame(loop);
    return () => {
      if (reqIdRef.current) {
        cancelAnimationFrame(reqIdRef.current);
      }
    }
  }, [callback]);
};

export const usePreview = (chart: Stepchart | null) => {
  const startTime = React.useRef<number>();
  const [playing, setPlaying] = React.useState(false);
  const [offset, setOffset] = React.useState(0);

  const timelineIndex = React.useRef(0);
  const secToOffset = React.useMemo(() => {
    if (!chart) return null;

    const timeline = extractTimelineEvents(chart);
    return (sec: number) => {
      let i;
      for (i = timelineIndex.current; timeline[i + 1] && timeline[i + 1].time < sec; i++);
      timelineIndex.current = i;
      return (sec - timeline[i].time) * timeline[i].bpm / 60 / 4 + timeline[i].offset;
    };
  }, [chart]);

  const play = React.useCallback(() => {
    if (chart) {
      startTime.current = (new Date()).getTime();
      timelineIndex.current = 0;
      setOffset(0);
      setPlaying(true);
    }
  }, [chart, setOffset, setPlaying]);

  const stop = React.useCallback(() => {
    setPlaying(false);
  }, [setOffset, setPlaying]);

  React.useEffect(() => {
    stop();
  }, [chart, stop]);

  const tick = React.useCallback(() => {
    if (playing && secToOffset && startTime.current) {
      setOffset(secToOffset(((new Date()).getTime() - startTime.current) / 1000));
    }
  }, [secToOffset, playing, setOffset]);
  useAnimationFrame(tick);

  return [offset, playing, play, stop];
};
