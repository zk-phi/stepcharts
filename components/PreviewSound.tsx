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
      if (enableBeatTick) {
        playSound(destinations.suppressed, audioBuffers.beat)
      }
      while (chart.beatTimeline[beatIndex.current]
          && chart.beatTimeline[beatIndex.current].time <= timeRef.current) {
        beatIndex.current++;
      }
    }
  }, [chart, enableBeatTick]);

  /* arrow ticks */
  const arrowIndex = React.useRef(0);
  const arrowSounder = React.useCallback(() => {
    if (chart.arrowTimeline[arrowIndex.current]
        && chart.arrowTimeline[arrowIndex.current].time <= timeRef.current) {
      const { shock, jump } = chart.arrowTimeline[arrowIndex.current].tags;
      if (shock) {
        playSound(destinations.suppressed, audioBuffers.shock);
      } else {
        playSound(destinations.normal, audioBuffers.tick);
        if (jump) {
          playSound(destinations.normal, audioBuffers.tick);
        }
      }
      while (chart.arrowTimeline[arrowIndex.current]
          && chart.arrowTimeline[arrowIndex.current].time <= timeRef.current) {
        arrowIndex.current++;
      }
    }
  }, [chart]);

  /* bpm ticks */
  const stopIndex = React.useRef(chart.bpmTimeline.findIndex((e) => (
    timeRef.current < e.time && e.bpm === 0
  )));
  const stopSounder = React.useCallback(() => {
    if (chart.bpmTimeline[stopIndex.current]
        && chart.bpmTimeline[stopIndex.current].time <= timeRef.current) {
      playSound(destinations.suppressed, audioBuffers.stop);
      while (chart.bpmTimeline[stopIndex.current] && (
        chart.bpmTimeline[stopIndex.current].bpm !== 0
        || chart.bpmTimeline[stopIndex.current].time <= timeRef.current
      )) {
        stopIndex.current++;
      }
    }
  }, [chart]);

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
    if (playing) {
      resetHandler();
      beatSounder();
      arrowSounder();
      stopSounder();
    }
  }, [resetHandler, beatSounder, arrowSounder, stopSounder, playing]);

  return null;
};

export default PreviewSound;
