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
  const [startTime, setStartTime] = React.useState<number>();
  const [sec, setSec] = React.useState(0);
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
    setStartTime((new Date()).getTime(), []);
  }, [audioContext, setAudioContext, setStartTime]);

  const tick = React.useCallback(() => {
    if (startTime) {
      setSec(((new Date()).getTime() - startTime) / 1000);
    } else {
      setSec(0);
    }
  }, [setSec, startTime]);
  useAnimationFrame(tick);

  const offset = React.useMemo(() => (
    secToOffset(sec)
  ), [sec]);

  return (
    <div style={{ display: "flex" }}>
      <ChartPreview chart={chart} speed={2} offset={offset} />
      <PreviewSound audioContext={audioContext} chart={chart} offset={offset} />
      <button onClick={play}>Play</button>
    </div>
  );
};

export default PreviewPage;
