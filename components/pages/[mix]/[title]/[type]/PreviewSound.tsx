import React from "react";
import { audioContext, audioBuffers, destinations } from "../../../../../lib/audioContext";

const playSound = (destination: AudioDestinationNode, buffer: AudioBuffer) => {
  if (audioContext && destination && buffer) {
    const player = new AudioBufferSourceNode(audioContext);
    player.buffer = buffer;
    player.connect(destination);
    player.start();
  }
};

const PreviewSound = ({ chart, offset }: {
  chart: Stepchart,
  offset: number,
}) => {
  const lastMeasure = React.useMemo(() => (
    Math.floor(chart.arrows[chart.arrows.length - 1].offset) + 1
  ), [chart]);

  /* beat ticks */
  const nextBeat = React.useRef(0);
  React.useEffect(() => {
    if (lastMeasure.current
        && nextBeat.current <= offset
        && offset <= lastMeasure.current) {
      playSound(destinations.suppressed, audioBuffers.beat);
      nextBeat.current = offset - (offset % 0.25) + 0.25;
    }
  }, [offset, lastMeasure, nextBeat]);

  /* arrow ticks */
  const arrowIndex = React.useRef(0);
  React.useEffect(() => {
    if (chart.arrows[arrowIndex.current]
        && chart.arrows[arrowIndex.current].offset <= offset) {
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
          && chart.arrows[arrowIndex.current].offset <= offset) {
        arrowIndex.current++;
      }
    }
  }, [offset, arrowIndex, chart]);

  /* stop ticks */
  const stopIndex = React.useRef(0);
  React.useEffect(() => {
    if (chart.stops[stopIndex.current]
        && chart.stops[stopIndex.current].offset <= offset) {
      playSound(destinations.suppressed, audioBuffers.stop);
      while (chart.stops[stopIndex.current]
          && chart.stops[stopIndex.current].offset <= offset) {
        stopIndex.current++;
      }
    }
  }, [offset, stopIndex]);

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

  /* rewind support */
  const lastOffset = React.useRef(0);
  React.useEffect(() => {
    if (offset < lastOffset.current) {
      nextBeat.current = offset - (offset % 0.25);
      arrowIndex.current = chart.arrows.findIndex((a) => offset < a.offset);
      stopIndex.current = chart.stops.findIndex((s) => offset < s.offset);
      // bpmIndex.current = chart.bpm.findIndex((b) => offset < b.startOffset);
    }
    lastOffset.current = offset;
  }, [offset, chart]);

  return null;
};

export default PreviewSound;
