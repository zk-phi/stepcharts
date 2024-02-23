import React from "react";
import { useAnimationFrame } from "./useAnimationFrame";
import {
  makeSecNumToOffsetConverter,
  makeOffsetNumToSecConverter,
} from "../analyzers/timingAnalyzers";

export const usePreview = (chart?: AnalyzedStepchart<number> | null): [
  React.MutableRefObject<number>,
  React.MutableRefObject<number>,
  boolean,
  (resume?: boolean) => void,
  () => void,
  (time: number) => void,
  (offset: number) => void,
] => {
  const startTimePos = React.useRef<number>();
  const startRealTime = React.useRef<number>();
  const [playing, setPlaying] = React.useState(false);

  // Time and offset values provided to components.
  // Wrapped with refs in order to avoid heavy rerendering.
  const timeRef = React.useRef<number>(0);
  const offsetRef = React.useRef<number>(0);

  const [lastMeasure, secToOffset, offsetToSec] = React.useMemo(() => chart ? [
    Math.floor(chart.arrowTimeline[chart.arrowTimeline.length - 1].offset) + 1,
    makeSecNumToOffsetConverter(chart.bpmTimeline),
    makeOffsetNumToSecConverter(chart.bpmTimeline),
  ] : [0, null, null], [chart]);

  const setOffset = React.useCallback((offset: number) => {
    if (!playing && offsetToSec) {
      offsetRef.current = offset;
      timeRef.current = offsetToSec(offset);
    }
  }, [playing]);

  const setTime = React.useCallback((time: number) => {
    if (!playing && secToOffset) {
      timeRef.current = time;
      offsetRef.current = secToOffset(time);
    }
  }, [playing]);

  const play = React.useCallback((resume?: boolean) => {
    if (chart) {
      if (!resume) {
        timeRef.current = 0;
        offsetRef.current = 0;
      }
      startTimePos.current = timeRef.current;
      startRealTime.current = (new Date()).getTime();
      setPlaying(true);
    }
  }, [chart, setPlaying]);

  const stop = React.useCallback(() => {
    setPlaying(false);
  }, [setPlaying]);

  React.useEffect(() => {
    stop();
    timeRef.current = 0;
    offsetRef.current = 0;
  }, [chart, stop]);

  useAnimationFrame(() => {
    if (playing && secToOffset && startRealTime.current && startTimePos.current !== null) {
      const elapsedTime = ((new Date()).getTime() - startRealTime.current) / 1000;
      timeRef.current = elapsedTime + startTimePos.current;
      offsetRef.current = secToOffset(timeRef.current);
      if (offsetRef.current >= lastMeasure) {
        stop();
      }
    }
  }, [playing, secToOffset, stop]);

  return [offsetRef, timeRef, playing, play, stop, setTime, setOffset];
};
