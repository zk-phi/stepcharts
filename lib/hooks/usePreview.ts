import React from "react";
import { useAnimationFrame } from "./useAnimationFrame";
import { makeSecNumToOffsetConverter } from "../analyzers/timingAnalyzers";

export const usePreview = (chart?: AnalyzedStepchart<number> | null): [
  React.MutableRefObject<number>,
  React.MutableRefObject<number>,
  boolean,
  () => void,
  () => void,
] => {
  const startTime = React.useRef<number>();
  const [playing, setPlaying] = React.useState(false);

  // Time and offset values provided to components.
  // Wrapped with refs in order to avoid heavy rerendering.
  const timeRef = React.useRef<number>(0);
  const offsetRef = React.useRef<number>(0);

  const lastMeasure = React.useMemo(() => (
    chart ? Math.floor(chart.arrowTimeline[chart.arrowTimeline.length - 1].offset) + 1 : 0
  ), [chart]);

  const secToOffset = React.useMemo(() => (
    makeSecNumToOffsetConverter(chart.bpmTimeline)
  ), [chart]);

  const play = React.useCallback(() => {
    if (chart) {
      startTime.current = (new Date()).getTime();
      timeRef.current = 0;
      offsetRef.current = 0;
      setPlaying(true);
    }
  }, [chart, startTime, timeRef, offsetRef, setPlaying]);

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
