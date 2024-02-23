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

const PreviewSound = ({ chart, timeRef, playing, enableBeatTick }: {
  chart: AnalyzedStepchart<number>,
  timeRef: React.MutableRefObject<number>,
  playing: boolean,
  enableBeatTick: boolean,
}) => {
  /* beat ticks */
  const beatIndex = React.useRef(0);
  const beatSounder = React.useCallback(() => {
    if (chart.beatTimeline[beatIndex.current]
        && chart.beatTimeline[beatIndex.current].time <= timeRef.current) {
      if (playing && enableBeatTick) {
        playSound(destinations.suppressed, audioBuffers.beat)
      }
      while (chart.beatTimeline[beatIndex.current]
          && chart.beatTimeline[beatIndex.current].time <= timeRef.current) {
        beatIndex.current++;
      }
    }
  }, [chart, enableBeatTick, playing]);

  /* arrow ticks */
  const arrowIndex = React.useRef(0);
  const arrowSounder = React.useCallback(() => {
    if (chart.arrowTimeline[arrowIndex.current]
        && chart.arrowTimeline[arrowIndex.current].time <= timeRef.current) {
      const isShock = chart.arrowTimeline[arrowIndex.current].direction.match(/M/);
      if (playing) {
        if (isShock) {
          playSound(destinations.suppressed, audioBuffers.shock);
        } else {
          const isJump = chart.arrowTimeline[arrowIndex.current].direction.match(/[12].*[12]/);
          playSound(destinations.normal, audioBuffers.tick);
          if (isJump) {
            playSound(destinations.normal, audioBuffers.tick);
          }
        }
      }
      while (chart.arrowTimeline[arrowIndex.current]
          && chart.arrowTimeline[arrowIndex.current].time <= timeRef.current) {
        arrowIndex.current++;
      }
    }
  }, [chart, playing]);

  /* bpm ticks */
  const stopIndex = React.useRef(chart.bpmTimeline.findIndex((e) => (
    timeRef.current < e.time && e.bpm === 0
  )));
  const stopSounder = React.useCallback(() => {
    if (chart.bpmTimeline[stopIndex.current]
        && chart.bpmTimeline[stopIndex.current].time <= timeRef.current) {
      if (playing) {
        playSound(destinations.suppressed, audioBuffers.stop);
      }
      while (chart.bpmTimeline[stopIndex.current] && (
        chart.bpmTimeline[stopIndex.current].bpm !== 0
        || chart.bpmTimeline[stopIndex.current].time <= timeRef.current
      )) {
        stopIndex.current++;
      }
    }
  }, [chart, playing]);

  const lastTime = React.useRef(0);
  const resetHandler = React.useCallback(() => {
    if (timeRef.current < lastTime.current) {
      beatIndex.current = chart.beatTimeline.findIndex((b) => (
        timeRef.current < b.time
      ))
      arrowIndex.current = chart.arrowTimeline.findIndex((a) => (
        timeRef.current < a.time
      ));
      stopIndex.current = chart.bpmTimeline.findIndex((e) => (
        timeRef.current < e.time && e.bpm === 0
      ));
    }
    lastTime.current = timeRef.current;
  }, [chart]);

  useAnimationFrame(() => {
    resetHandler();
    beatSounder();
    arrowSounder();
    stopSounder();
  }, [resetHandler, beatSounder, arrowSounder, stopSounder]);

  return null;
};

export default PreviewSound;
