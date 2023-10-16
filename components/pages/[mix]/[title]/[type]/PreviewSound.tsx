import React from "react";
import { audioContext, audioBuffers, destinations } from "../../../../../lib/audioContext";
import { useAnimationFrame } from "../../../../../lib/hooks/useAnimationFrame";

const playSound = (
  destination: AudioNode | null,
  buffer: AudioBuffer | null,
  detune?: number,
): boolean => {
  if (audioContext && destination && buffer) {
    const player = new AudioBufferSourceNode(audioContext);
    player.buffer = buffer;
    if (detune) {
      player.detune.value = detune;
    }
    player.connect(destination);
    player.start();
    return true;
  }
  return false;
};

const PreviewSound = ({ chart, offsetRef, enableBeatTick }: {
  chart: ChartData,
  offsetRef: React.MutableRefObject<number>,
  enableBeatTick: boolean,
}) => {
  const lastMeasure = React.useMemo(() => (
    Math.floor(chart.arrows[chart.arrows.length - 1].offset) + 1
  ), [chart]);

  /* beat ticks */
  const nextBeat = React.useRef(0);
  const beatSounder = React.useCallback(() => {
    if (enableBeatTick
        && nextBeat.current < offsetRef.current
        && offsetRef.current <= lastMeasure) {
      const detune = nextBeat.current % 1 === 0 ? 400 : 0;
      if (playSound(destinations.suppressed, audioBuffers.beat, detune)) {
        nextBeat.current = offsetRef.current - (offsetRef.current % 0.25) + 0.25;
      }
    }
  }, [enableBeatTick, offsetRef, lastMeasure, nextBeat]);

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

  /* bpm ticks */
  const stopIndex = React.useRef(chart.bpmTimeline.findIndex((e) => (
    offsetRef.current < e.offset && e.bpm === 0
  )));
  const stopSounder = React.useCallback(() => {
    if (chart.bpmTimeline[stopIndex.current]
        && chart.bpmTimeline[stopIndex.current].offset <= offsetRef.current) {
      playSound(destinations.suppressed, audioBuffers.stop);
      while (chart.bpmTimeline[stopIndex.current] && (
        chart.bpmTimeline[stopIndex.current].bpm !== 0
        || chart.bpmTimeline[stopIndex.current].offset <= offsetRef.current
      )) {
        stopIndex.current++;
      }
    }
  }, [offsetRef, stopIndex]);

  const lastOffset = React.useRef(0);
  const resetHandler = React.useCallback(() => {
    if (offsetRef.current < lastOffset.current) {
      nextBeat.current = offsetRef.current - (offsetRef.current % 0.25);
      arrowIndex.current = chart.arrows.findIndex((a) => offsetRef.current < a.offset);
      nextBeat.current = chart.bpmTimeline.findIndex((e) => (
        offsetRef.current < e.offset && e.bpm === 0
      ));
    }
    lastOffset.current = offsetRef.current;
  }, [offsetRef, lastOffset, chart]);

  useAnimationFrame(() => {
    resetHandler();
    beatSounder();
    arrowSounder();
    stopSounder();
  }, [resetHandler, beatSounder, arrowSounder, stopSounder]);

  return null;
};

export default PreviewSound;
