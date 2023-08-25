import React from "react";

const PreviewSound = ({ audioContext, chart, offset }: {
  audioContext?: AudioContext,
  chart: Stepchart,
  offset: number,
}) => {
  const [tickBuffer, setTickBuffer] = React.useState<AudioBuffer>(null);
  const [stopBuffer, setStopBuffer] = React.useState<AudioBuffer>(null);
  const [bpmBuffer, setBpmBuffer] = React.useState<AudioBuffer>(null);
  const [arrowIndex, setArrowIndex] = React.useState(0);
  const [stopIndex, setStopIndex] = React.useState(0);
  const [bpmIndex, setBpmIndex] = React.useState(1);

  React.useEffect(() => {
    const maybeDecodeBuffer = async () => {
      if (audioContext) {
        const tickFile = await fetch("/cursor12.mp3");
        const stopFile = await fetch("/cursor4.mp3");
        const bpmFile = await fetch("/cancel1.mp3");
        const tickArray = await tickFile.arrayBuffer();
        const stopArray = await stopFile.arrayBuffer();
        const bpmArray = await bpmFile.arrayBuffer();
        setTickBuffer(await audioContext.decodeAudioData(tickArray));
        setStopBuffer(await audioContext.decodeAudioData(stopArray))
        setBpmBuffer(await audioContext.decodeAudioData(bpmArray));
      }
    }
    maybeDecodeBuffer();
  }, [audioContext, setTickBuffer, setStopBuffer]);

  React.useEffect(() => {
    if (audioContext && tickBuffer && chart.arrows[arrowIndex]
        && chart.arrows[arrowIndex].offset <= offset) {
      const player = new AudioBufferSourceNode(audioContext);
      player.buffer = tickBuffer;
      player.connect(audioContext.destination);
      player.start();
      let i;
      for (i = arrowIndex + 1;
        chart.arrows[i] && chart.arrows[i].offset <= offset;
        i++);
      setArrowIndex(i);
    }
  }, [offset, arrowIndex, setArrowIndex]);

  React.useEffect(() => {
    if (audioContext && tickBuffer && chart.stops[stopIndex]
        && chart.stops[stopIndex].offset <= offset) {
      const player = new AudioBufferSourceNode(audioContext);
      player.buffer = stopBuffer;
      player.connect(audioContext.destination);
      player.start();
      let i;
      for (i = stopIndex + 1;
        chart.stops[i] && chart.stops[i].offset <= offset;
        i++);
      setStopIndex(i);
    }
  }, [offset, stopIndex, setStopIndex]);

  React.useEffect(() => {
    if (audioContext && tickBuffer && chart.bpm[bpmIndex]
        && chart.bpm[bpmIndex].startOffset <= offset) {
      const player = new AudioBufferSourceNode(audioContext);
      player.buffer = bpmBuffer;
      player.connect(audioContext.destination);
      player.start();
      let i;
      for (i = bpmIndex + 1;
        chart.bpm[i] && chart.bpm[i].startOffset <= offset;
        i++);
      setBpmIndex(i);
    }
  }, [offset, bpmIndex, setBpmIndex]);

  /* test */
  React.useEffect(() => {
    if (audioContext && tickBuffer) {
      const player = new AudioBufferSourceNode(audioContext);
      player.buffer = tickBuffer;
      player.connect(audioContext.destination);
      player.start();
    }
  }, [audioContext, tickBuffer]);

  return null;
};

export default PreviewSound;
