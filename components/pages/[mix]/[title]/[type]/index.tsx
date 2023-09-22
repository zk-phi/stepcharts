import React from "react";
import ChartPreview from "./ChartPreview";
import PreviewSound from "./PreviewSound";
import { extractTimelineEvents, TimelineBpmEvent } from "../../../../../lib/computeChartTimeline";
import { usePreview } from "../../../../../lib/hooks/usePreview";

let audioContext: AudioContext | null = null;

const PreviewPage = ({ chart }: {
  chart: Stepchart,
}) => {
  const [offset, playing, start, stop] = usePreview(chart);

  const play = React.useCallback(() => {
    if (!audioContext) {
      audioContext = new AudioContext();
    }
    start();
  }, [start]);

  return (
    <div style={{ display: "flex" }}>
      <ChartPreview chart={chart} speed={2} offset={offset} />
      <PreviewSound audioContext={audioContext} chart={chart} offset={offset} />
      <button onClick={play}>Play</button>
    </div>
  );
};

export default PreviewPage;
