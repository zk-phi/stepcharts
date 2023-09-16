import React from "react";

const PreviewSound = ({ audioContext, chart, offset }: {
  audioContext?: AudioContext,
  chart: Stepchart,
  offset: number,
}) => {
  const tickBuffer     = React.useRef<AudioBuffer>();
  const stopBuffer     = React.useRef<AudioBuffer>();
  const bpmBuffer      = React.useRef<AudioBuffer>();
  const shockBuffer    = React.useRef<AudioBuffer>();
  const gainNode       = React.useRef<GainNode>();
  const suppressorNode = React.useRef<GainNode>();
  React.useEffect(() => {
    const maybeDecodeBuffer = async () => {
      if (audioContext) {
        const tickFile  = await fetch("/stepcharts/cursor12.mp3");
        const stopFile  = await fetch("/stepcharts/cursor4.mp3");
        const bpmFile   = await fetch("/stepcharts/cancel1.mp3");
        const shockFile = await fetch("/stepcharts/cursor6.mp3");
        const tickArray  = await tickFile.arrayBuffer();
        const stopArray  = await stopFile.arrayBuffer();
        const bpmArray   = await bpmFile.arrayBuffer();
        const shockArray = await shockFile.arrayBuffer();
        tickBuffer.current  = await audioContext.decodeAudioData(tickArray);
        stopBuffer.current  = await audioContext.decodeAudioData(stopArray)
        bpmBuffer.current   = await audioContext.decodeAudioData(bpmArray);
        shockBuffer.current = await audioContext.decodeAudioData(shockArray);
        gainNode.current = new GainNode(audioContext);
        gainNode.current.gain.value = 2;
        gainNode.current.connect(audioContext.destination);
        suppressorNode.current = new GainNode(audioContext);
        suppressorNode.current.gain.value = 0.25;
        suppressorNode.current.connect(audioContext.destination);
      }
    }
    maybeDecodeBuffer();
  }, [audioContext]);

  /* arrow ticks */
  const arrowIndex = React.useRef(0);
  React.useEffect(() => {
    if (audioContext
        && tickBuffer.current
        && shockBuffer.current
        && chart.arrows[arrowIndex.current]
        && chart.arrows[arrowIndex.current].offset <= offset) {
      const player = new AudioBufferSourceNode(audioContext);
      const isShock = chart.arrows[arrowIndex.current].direction.match(/M/);
      const isJump = chart.arrows[arrowIndex.current].direction.match(/[12].*[12]/);
      player.buffer = isShock ? shockBuffer.current : tickBuffer.current;
      player.connect(
        isJump && gainNode.current ? gainNode.current :
        isShock && suppressorNode.current ? suppressorNode.current :
        audioContext.destination
      );
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
        && stopBuffer.current
        && suppressorNode.current
        && chart.stops[stopIndex.current]
        && chart.stops[stopIndex.current].offset <= offset) {
      const player = new AudioBufferSourceNode(audioContext);
      player.buffer = stopBuffer.current;
      player.connect(suppressorNode.current);
      player.start();
      let i;
      for (i = stopIndex.current + 1; chart.stops[i] && chart.stops[i].offset <= offset; i++);
      stopIndex.current = i;
    }
  }, [offset]);

  /* bpm-shift ticks */
  const bpmIndex = React.useRef(1);
  React.useEffect(() => {
    if (audioContext
        && bpmBuffer.current
        && suppressorNode.current
        && chart.bpm[bpmIndex.current]
        && chart.bpm[bpmIndex.current].startOffset <= offset) {
      const player = new AudioBufferSourceNode(audioContext);
      player.buffer = bpmBuffer.current;
      player.connect(suppressorNode.current);
      player.start();
      let i;
      for (i = bpmIndex.current + 1; chart.bpm[i] && chart.bpm[i].startOffset <= offset; i++);
      bpmIndex.current = i;
    }
  }, [offset]);

  /* rewind support */
  const lastOffset = React.useRef(0);
  React.useEffect(() => {
    if (offset < lastOffset.current) {
      arrowIndex.current = chart.arrows.findIndex((a) => offset < a.offset);
      stopIndex.current = chart.stops.findIndex((s) => offset < s.offset);
      bpmIndex.current = chart.bpm.findIndex((b) => offset < b.startOffset);
    }
    lastOffset.current = offset;
  }, [offset, chart]);

  return null;
};

export default PreviewSound;
