import React from "react";

const PreviewSound = ({ audioContext, chart, offset }: {
  audioContext?: AudioContext | null,
  chart: Stepchart,
  offset: number,
}) => {
  const tickBuffer     = React.useRef<AudioBuffer>();
  const stopBuffer     = React.useRef<AudioBuffer>();
  const bpmBuffer      = React.useRef<AudioBuffer>();
  const shockBuffer    = React.useRef<AudioBuffer>();
  const beatBuffer     = React.useRef<AudioBuffer>();
  const suppressorNode = React.useRef<GainNode>();
  React.useEffect(() => {
    const maybeDecodeBuffer = async () => {
      if (audioContext) {
        const tickFile    = await fetch("/stepcharts/cursor12.mp3");
        const stopFile    = await fetch("/stepcharts/cursor4.mp3");
        const bpmFile     = await fetch("/stepcharts/cancel1.mp3");
        const shockFile   = await fetch("/stepcharts/cursor7.mp3");
        const beatFile    = await fetch("/stepcharts/cursor6.mp3");
        const tickArray    = await tickFile.arrayBuffer();
        const stopArray    = await stopFile.arrayBuffer();
        const bpmArray     = await bpmFile.arrayBuffer();
        const shockArray   = await shockFile.arrayBuffer();
        const beatArray    = await beatFile.arrayBuffer();
        tickBuffer.current    = await audioContext.decodeAudioData(tickArray);
        stopBuffer.current    = await audioContext.decodeAudioData(stopArray)
        bpmBuffer.current     = await audioContext.decodeAudioData(bpmArray);
        shockBuffer.current   = await audioContext.decodeAudioData(shockArray);
        beatBuffer.current    = await audioContext.decodeAudioData(beatArray);
        suppressorNode.current = new GainNode(audioContext);
        suppressorNode.current.gain.value = 0.25;
        suppressorNode.current.connect(audioContext.destination);
      }
    }
    maybeDecodeBuffer();
  }, [audioContext]);

  /* beat ticks */
  const nextBeat = React.useRef(0);
  const lastMeasure = React.useRef(Math.floor(chart.arrows[chart.arrows.length - 1].offset) + 1);
  React.useEffect(() => {
    if (audioContext
        && beatBuffer.current
        && suppressorNode.current
        && lastMeasure.current
        && nextBeat.current <= offset
        && offset <= lastMeasure.current) {
      const player = new AudioBufferSourceNode(audioContext);
      player.buffer = beatBuffer.current;
      player.connect(suppressorNode.current);
      player.start();
      nextBeat.current = nextBeat.current + 0.25;
    }
  }, [offset]);

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
        isShock && suppressorNode.current ? suppressorNode.current :
        audioContext.destination
      );
      if (isJump) {
        const anotherPlayer = new AudioBufferSourceNode(audioContext);
        anotherPlayer.buffer = tickBuffer.current;
        anotherPlayer.detune.value = 50;
        anotherPlayer.connect(audioContext.destination);
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

  // /* bpm-shift ticks */
  // const bpmIndex = React.useRef(1);
  // React.useEffect(() => {
  //   if (audioContext
  //       && bpmBuffer.current
  //       && suppressorNode.current
  //       && chart.bpm[bpmIndex.current]
  //       && chart.bpm[bpmIndex.current].startOffset <= offset) {
  //     const player = new AudioBufferSourceNode(audioContext);
  //     player.buffer = bpmBuffer.current;
  //     player.connect(suppressorNode.current);
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
