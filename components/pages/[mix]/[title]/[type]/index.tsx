import React from "react";
import ChartPreview from "./ChartPreview";
import PreviewSound from "./PreviewSound";
import { extractTimelineEvents, TimelineBpmEvent } from "../../../../../lib/computeChartTimeline";
import { usePreview } from "../../../../../lib/hooks/usePreview";
import { prepareAudioContext } from "../.../../../../../../lib/audioContext";

const PreviewPage = ({ chart }: {
  chart: Stepchart,
}) => {
  const [offsetRef, playing, start, stop] = usePreview(chart);

  const play = React.useCallback(async () => {
    await prepareAudioContext();
    start();
  }, [start]);

  return (
    <div style={{ display: "flex" }}>
      <ChartPreview chart={chart} speed={2} offsetRef={offsetRef} playing={playing} />
      <PreviewSound chart={chart} offsetRef={offsetRef} />
      <button onClick={play}>Play</button>
    </div>
  );
};

export default PreviewPage;
