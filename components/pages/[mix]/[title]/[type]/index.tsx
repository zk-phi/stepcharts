import React from "react";
import ChartPreview from "./ChartPreview";
import PreviewSound from "./PreviewSound";
import { extractTimelineEvents, TimelineBpmEvent } from "../../../../../lib/computeChartTimeline";
import { usePreview } from "../../../../../lib/hooks/usePreview";
import { prepareAudioContext } from "../.../../../../../../lib/audioContext";

const PreviewPage = ({ chart }: {
  chart: Stepchart,
}) => {
  const [offset, playing, start, stop] = usePreview(chart);

  const play = React.useCallback(async () => {
    await prepareAudioContext();
    start();
  }, [start]);

  return (
    <div style={{ display: "flex" }}>
      <ChartPreview chart={chart} speed={2} offset={offset} />
      <PreviewSound chart={chart} offset={offset} />
      <button onClick={play}>Play</button>
    </div>
  );
};

export default PreviewPage;
