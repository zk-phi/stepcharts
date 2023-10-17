import React from "react";
import ChartPreview from "./ChartPreview";
import PreviewSound from "./PreviewSound";
import { usePreview } from "../../../../../lib/hooks/usePreview";
import { prepareAudioContext } from "../../../../../lib/audioContext";
import { TURNS } from "../../../../../constants/turn";

const PreviewPage = ({ chart }: {
  chart: ChartData,
}) => {
  const [offsetRef, playing, start, stop] = usePreview(chart);
  const [speed, setSpeed] = React.useState(() => (
    Math.floor(620 / chart.meta.mainBpm * 4) / 4
  ));
  const [tick, setTick] = React.useState(() => (
    chart.arrows.reduce((l, r) => l + (r.beat === 4 ? 1 : 0), 0) >= chart.arrows.length / 4
  ));
  const [turn, setTurn] = React.useState<Turn>("OFF");
  const [showModal, setShowModal] = React.useState(false);

  const onChangeSpeed = React.useCallback((e) => setSpeed(Number(e.target.value)), [setSpeed]);
  const onChangeTurn = React.useCallback((e) => setTurn(e.target.value), [setTurn]);
  const onChangeTick = React.useCallback((e) => setTick(e.target.checked), [setTick])

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
          turn={turn}
          showBeat={tick} />
      <PreviewSound
          chart={chart}
          offsetRef={offsetRef}
          enableBeatTick={tick} />
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
            x{speed} (
            {chart.meta.minBpm !== chart.meta.mainBpm ? `${chart.meta.minBpm * speed}-` : ''}
            {chart.meta.mainBpm * speed}
            {chart.meta.mainBpm !== chart.meta.maxBpm ? `-${chart.meta.maxBpm * speed}` : ''})
          </div>
          <div>
            Turn:
            {" "}
            <select value={turn} onInput={onChangeTurn}>
              {TURNS.map((turn) => (
                <option key={turn} value={turn}>{turn}</option>
              ))}
            </select>
          </div>
          <div>
            Beat:
            {" "}
            <input type="checkbox" checked={tick} onChange={onChangeTick} />
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
