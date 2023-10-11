import React from "react";
import ChartPreview from "./ChartPreview";
import PreviewSound from "./PreviewSound";
import { extractTimelineEvents, TimelineBpmEvent } from "../../../../../lib/computeChartTimeline";
import { usePreview } from "../../../../../lib/hooks/usePreview";
import { prepareAudioContext } from "../.../../../../../../lib/audioContext";

const PreviewPage = ({ chart }: {
  chart: ChartData,
}) => {
  const [offsetRef, playing, start, stop] = usePreview(chart);
  const [speed, setSpeed] = React.useState(2);
  const [turn, setTurn] = React.useState<Turn>("off");
  const [showModal, setShowModal] = React.useState(false);

  const onChangeSpeed = React.useCallback((e) => setSpeed(Number(e.target.value)), [setSpeed]);
  const onChangeTurn = React.useCallback((e) => setTurn(e.target.value), [setTurn]);

  const closeModal = React.useCallback(() => setShowModal(false), [setShowModal]);
  const openModal = React.useCallback(() => setShowModal(true), [setShowModal]);

  const play = React.useCallback(async () => {
    await prepareAudioContext();
    start();
    setShowModal(false);
  }, [start]);

  const pause = React.useCallback(() => {
    stop();
    setShowModal(false);
  }, [stop]);

  const controllStyle: React.CSSProperties = {
    position: "absolute",
    padding: 16,
    width: "100vw",
    height: "100vh",
    background: "#ffffff80",
  };

  return (
    <div style={{ display: "flex" }}>
      <ChartPreview
          chart={chart}
          speed={speed}
          offsetRef={offsetRef}
          playing={playing}
          turn={turn} />
      <PreviewSound
          chart={chart}
          offsetRef={offsetRef} />
      { showModal && (
        <div style={controllStyle}>
          <div>
            Speed:
            {" "}
            <input
                type="range"
                min="0.25"
                max="8"
                step="0.25"
                value={speed}
                onInput={onChangeSpeed} />
            x{speed} ({chart.meta.minBpm * speed} - {chart.meta.maxBpm * speed})
          </div>
          <div>
            Turn:
            {" "}
            <select value={turn} onInput={onChangeTurn}>
              <option value="off">off</option>
              <option value="mirror">mirror</option>
              <option value="left">left</option>
              <option value="right">right</option>
            </select>
          </div>
          <button onClick={closeModal}>[Close]</button>
          {" "}
          { playing ? (
            <button onClick={pause}>[STOP]</button>
          ) : (
            <button onClick={play}>[PLAY]</button>
          ) }
        </div>
      ) }
      <button onClick={openModal}>⚙️</button>
    </div>
  );
};

export default PreviewPage;
