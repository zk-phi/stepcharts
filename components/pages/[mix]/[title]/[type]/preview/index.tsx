import React from "react";
import ChartPreview from "./ChartPreview";
import PreviewSound from "./PreviewSound";
import { extractTimelineEvents, TimelineBpmEvent } from "../../../../../../lib/computeChartTimeline";

const useAnimationFrame = (callback = () => {}) => {
  const reqIdRef = React.useRef<number>();

  React.useEffect(() => {
    const loop = () => {
      reqIdRef.current = requestAnimationFrame(loop);
      callback();
    };
    reqIdRef.current = requestAnimationFrame(loop);
    return () => {
      if (reqIdRef.current) {
        cancelAnimationFrame(reqIdRef.current);
      }
    }
  }, [callback]);
};

const PreviewPage = ({ chart }: {
  chart: Stepchart,
}) => {
  const startTime = React.useRef<number>();
  const [offset, setOffset] = React.useState(0);
  const [audioContext, setAudioContext] = React.useState<AudioContext>();

  const secToOffset = React.useMemo(() => {
    const timeline = extractTimelineEvents(chart);
    return (sec: number) => {
      const section = timeline.find((e) => sec >= e.time)!;
      return (sec - section.time) * section.bpm / 60 / 4 + section.offset;
    };
  }, [chart]);

  const play = React.useCallback(() => {
    if (!audioContext) {
      setAudioContext(new AudioContext());
    }
    startTime.current = (new Date()).getTime();
  }, [audioContext, setAudioContext]);

  const tick = React.useCallback(() => {
    if (startTime.current) {
      setOffset(secToOffset(((new Date()).getTime() - startTime.current) / 1000));
    } else {
      setOffset(0);
    }
  }, [setOffset]);
  useAnimationFrame(tick);

  return (
    <div style={{ display: "flex" }}>
      <ChartPreview chart={chart} speed={2} offset={offset} />
      <PreviewSound audioContext={audioContext} chart={chart} offset={offset} />
      <button onClick={play}>Play</button>
    </div>
  );
};

export default PreviewPage;
