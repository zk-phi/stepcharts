import React from "react";
import { audioContext, audioBuffers, destinations } from "../../../../../lib/audioContext";

const PreviewSound = ({ chart, offset }: {
  chart: Stepchart,
  offset: number,
}) => {
  /* beat ticks */
  const nextBeat = React.useRef(0);
  const lastMeasure = React.useRef(Math.floor(chart.arrows[chart.arrows.length - 1].offset) + 1);
  React.useEffect(() => {
    if (audioContext
        && audioBuffers.beat
        && destinations.suppressed
        && lastMeasure.current
        && nextBeat.current <= offset
        && offset <= lastMeasure.current) {
      const player = new AudioBufferSourceNode(audioContext);
      player.buffer = audioBuffers.beat;
      player.connect(destinations.suppressed);
      player.start();
      nextBeat.current = offset - (offset % 0.25) + 0.25;
    }
  }, [offset]);

  /* arrow ticks */
  const arrowIndex = React.useRef(0);
  React.useEffect(() => {
    if (audioContext
        && audioBuffers.tick
        && audioBuffers.shock
        && destinations.normal
        && destinations.suppressed
        && chart.arrows[arrowIndex.current]
        && chart.arrows[arrowIndex.current].offset <= offset) {
      const player = new AudioBufferSourceNode(audioContext);
      const isShock = chart.arrows[arrowIndex.current].direction.match(/M/);
      const isJump = chart.arrows[arrowIndex.current].direction.match(/[12].*[12]/);
      player.buffer = isShock ? audioBuffers.shock : audioBuffers.tick;
      player.connect(isShock ? destinations.suppressed : destinations.normal);
      if (isJump) {
        const anotherPlayer = new AudioBufferSourceNode(audioContext);
        anotherPlayer.buffer = audioBuffers.tick;
        anotherPlayer.connect(destinations.normal);
        anotherPlayer.start();
      }
      player.start();
      let i;
      for (i = arrowIndex.current + 1; chart.arrows[i] && chart.arrows[i].offset <= offset; i++);
      arrowIndex.current = i;
    }
  }, [offset]);

  /* stop ticks */
  const stopIndex = React.useRef(0);
  React.useEffect(() => {
    if (audioContext
        && audioBuffers.stop
        && destinations.suppressed
        && chart.stops[stopIndex.current]
        && chart.stops[stopIndex.current].offset <= offset) {
      const player = new AudioBufferSourceNode(audioContext);
      player.buffer = audioBuffers.stop;
      player.connect(destinations.suppressed);
      player.start();
      let i;
      for (i = stopIndex.current + 1; chart.stops[i] && chart.stops[i].offset <= offset; i++);
      stopIndex.current = i;
    }
  }, [offset]);

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
      nextBeat.current = offset - (offset % 0.25) + 0.25;
      arrowIndex.current = chart.arrows.findIndex((a) => offset < a.offset);
      stopIndex.current = chart.stops.findIndex((s) => offset < s.offset);
      // bpmIndex.current = chart.bpm.findIndex((b) => offset < b.startOffset);
    }
    lastOffset.current = offset;
  }, [offset, chart]);

  return null;
};

export default PreviewSound;
