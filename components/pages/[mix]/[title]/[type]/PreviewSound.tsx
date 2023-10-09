import React from "react";
import { audioContext, audioBuffers, destinations } from "../../../../../lib/audioContext";
import { useAnimationFrame } from "../../../../../lib/hooks/useAnimationFrame";

const playSound = (destination: AudioDestinationNode, buffer: AudioBuffer) => {
  if (audioContext && destination && buffer) {
    const player = new AudioBufferSourceNode(audioContext);
    player.buffer = buffer;
    player.connect(destination);
    player.start();
  }
};

const PreviewSound = ({ chart, offsetRef }: {
  chart: Stepchart,
  offsetRef: React.Ref<number>,
}) => {
  const lastMeasure = React.useMemo(() => (
    Math.floor(chart.arrows[chart.arrows.length - 1].offset) + 1
  ), [chart]);

  /* beat ticks */
  const nextBeat = React.useRef(0);
  const beatSounder = React.useCallback(() => {
    if (nextBeat.current <= offsetRef.current
        && offsetRef.current <= lastMeasure) {
      playSound(destinations.suppressed, audioBuffers.beat);
      nextBeat.current = offsetRef.current - (offsetRef.current % 0.25) + 0.25;
    }
  }, [offsetRef, lastMeasure, nextBeat]);

  /* arrow ticks */
  const arrowIndex = React.useRef(0);
  const arrowSounder = React.useCallback(() => {
    if (chart.arrows[arrowIndex.current]
        && chart.arrows[arrowIndex.current].offset <= offsetRef.current) {
      const isShock = chart.arrows[arrowIndex.current].direction.match(/M/);
      if (isShock) {
        playSound(destinations.suppressed, audioBuffers.shock);
      } else {
        const isJump = chart.arrows[arrowIndex.current].direction.match(/[12].*[12]/);
        playSound(destinations.normal, audioBuffers.tick);
        if (isJump) {
          playSound(destinations.normal, audioBuffers.tick);
        }
      }
      while (chart.arrows[arrowIndex.current]
          && chart.arrows[arrowIndex.current].offset <= offsetRef.current) {
        arrowIndex.current++;
      }
    }
  }, [offsetRef, arrowIndex, chart]);

  /* stop ticks */
  const stopIndex = React.useRef(0);
  const stopSounder = React.useCallback(() => {
    if (chart.stops[stopIndex.current]
        && chart.stops[stopIndex.current].offset <= offsetRef.current) {
      playSound(destinations.suppressed, audioBuffers.stop);
      while (chart.stops[stopIndex.current]
          && chart.stops[stopIndex.current].offset <= offsetRef.current) {
        stopIndex.current++;
      }
    }
  }, [offsetRef, stopIndex]);

  const lastOffset = React.useRef(0);
  const resetHandler = React.useCallback(() => {
    if (offsetRef.current < lastOffset.current) {
      nextBeat.current = offsetRef.current - (offsetRef.current % 0.25);
      arrowIndex.current = chart.arrows.findIndex((a) => offsetRef.current < a.offset);
      stopIndex.current = chart.stops.findIndex((s) => offsetRef.current < s.offset);
      // bpmIndex.current = chart.bpm.findIndex((b) => offset < b.startOffset);
    }
    lastOffset.current = offsetRef.current;
  }, [offsetRef, lastOffset, chart]);

  const handler = React.useCallback(() => {
    resetHandler();
    beatSounder();
    arrowSounder();
    stopSounder();
  }, [resetHandler, beatSounder, arrowSounder, stopSounder]);

  useAnimationFrame(handler);

  // /* bpm-shift ticks */
  // const bpmIndex = React.useRef(1);
  // React.useEffect(() => {
  //   if (audioContext
  //       && audioBuffers.bpm
  //       && destinations.suppressed
  //       && chart.bpm[bpmIndex.current]
  //       && chart.bpm[bpmIndex.current].startOffset <= offset) {
  //     const player = new AudioBufferSourceNode(audioContext);
  //     player.buffer = audioBuffers.bpm;
  //     player.connect(destinations.suppressed);
  //     player.start();
  //     let i;
  //     for (i = bpmIndex.current + 1; chart.bpm[i] && chart.bpm[i].startOffset <= offset; i++);
  //     bpmIndex.current = i;
  //   }
  // }, [offset]);

  return null;
};

export default PreviewSound;
