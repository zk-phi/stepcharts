import React from "react";
import { audioContext, audioBuffers, destinations } from "../lib/audioContext";
import { useAnimationFrame } from "../lib/hooks/useAnimationFrame";

const playSound = (
  destination: AudioNode | null,
  buffer: AudioBuffer | null,
): boolean => {
  if (audioContext && destination && buffer) {
    const player = new AudioBufferSourceNode(audioContext);
    player.buffer = buffer;
    player.connect(destination);
    player.start();
    return true;
  }
  return false;
};

const PreviewSound = ({ chart, offsetRef, timeRef, enableBeatTick }: {
  chart: AnalyzedStepchart<number>,
  offsetRef: React.MutableRefObject<number>,
  timeRef: React.MutableRefObject<number>,
  enableBeatTick: boolean,
}) => {
  /* beat ticks */
  const nextBeat = React.useRef(0);
  const beatSounder = React.useCallback(() => {
    if (enableBeatTick
        && nextBeat.current < offsetRef.current) {
      if (playSound(destinations.suppressed, audioBuffers.beat)) {
        nextBeat.current = offsetRef.current - (offsetRef.current % 0.25) + 0.25;
      }
    }
  }, [enableBeatTick, offsetRef, nextBeat]);

  /* arrow ticks */
  const arrowIndex = React.useRef(0);
  const arrowSounder = React.useCallback(() => {
    if (chart.arrowTimeline[arrowIndex.current]
        && chart.arrowTimeline[arrowIndex.current].time <= timeRef.current) {
      const isShock = chart.arrowTimeline[arrowIndex.current].direction.match(/M/);
      if (isShock) {
        playSound(destinations.suppressed, audioBuffers.shock);
      } else {
        const isJump = chart.arrowTimeline[arrowIndex.current].direction.match(/[12].*[12]/);
        playSound(destinations.normal, audioBuffers.tick);
        if (isJump) {
          playSound(destinations.normal, audioBuffers.tick);
        }
      }
      while (chart.arrowTimeline[arrowIndex.current]
          && chart.arrowTimeline[arrowIndex.current].time <= timeRef.current) {
        arrowIndex.current++;
      }
    }
  }, [timeRef, arrowIndex, chart]);

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
  }, [offsetRef, stopIndex, chart]);

  const lastOffset = React.useRef(0);
  const resetHandler = React.useCallback(() => {
    if (offsetRef.current < lastOffset.current) {
      nextBeat.current = offsetRef.current - (offsetRef.current % 0.25);
      arrowIndex.current = chart.arrowTimeline.findIndex((a) => (
        offsetRef.current < a.offset
      ));
      stopIndex.current = chart.bpmTimeline.findIndex((e) => (
        offsetRef.current < e.offset && e.bpm === 0
      ));
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
