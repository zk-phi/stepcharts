import React from "react";
import ChartPreview from "../../../../ChartPreview";
import PreviewSound from "../../../../PreviewSound";
import { usePreview } from "../../../../../lib/hooks/usePreview";
import { prepareAudioContext } from "../../../../../lib/audioContext";
import { TURNS } from "../../../../../constants/turn";

const defaultSpeedFn = (mainBpm: number) => Math.floor(620 / mainBpm * 4) / 4

type Options = {
  speed: number,
  tick: boolean,
  constantMode: boolean,
  colorFreezes: boolean,
  diminishFreezes: boolean,
  soflanBg: boolean,
  soflanValue: boolean,
  highlightSoflan: boolean,
};

const OptionsPanel = ({
  options,
  onChange,
  style,
  minBpm,
  mainBpm,
  maxBpm,
  onClose,
}: {
  options: Options,
  onChange: (newValue: Options) => void,
  style: React.CSSProperties,
  minBpm: number,
  mainBpm: number,
  maxBpm: number,
  onClose: () => void,
}) => {
  const onChangeSpeed = React.useCallback((e) => onChange({
    ...options,
    speed: Number(e.target.value),
  }), [options, onChange]);

  const onChangeTick = React.useCallback((e) => onChange({
    ...options,
    tick: e.target.checked,
  }), [options, onChange]);

  const onChangeConstantMode = React.useCallback((e) => onChange({
    ...options,
    constantMode: e.target.checked,
    speed: defaultSpeedFn(e.target.checked ? 240 : mainBpm),
  }), [options, onChange]);

  const onChangeColorFreezes = React.useCallback((e) => onChange({
    ...options,
    colorFreezes: e.target.checked,
  }), [options, onChange]);

  const onChangeDiminishFreezes = React.useCallback((e) => onChange({
    ...options,
    diminishFreezes: e.target.checked,
  }), [options, onChange]);

  const onChangeSoflanBg = React.useCallback((e) => onChange({
    ...options,
    soflanBg: e.target.checked,
  }), [options, onChange]);

  const onChangeSoflanValue = React.useCallback((e) => onChange({
    ...options,
    soflanValue: e.target.checked,
  }), [options, onChange]);

  const onChangeHighlightSoflan = React.useCallback((e) => onChange({
    ...options,
    highlightSoflan: e.target.checked,
  }), [options, onChange]);

  return (
    <div style={style}>
      <div>
        Speed:
        {" "}
        <input
            type="range"
            min="0.25"
            max="8"
            step="0.25"
            value={options.speed}
            onInput={onChangeSpeed} />
        x{options.speed}
        {!options.constantMode ? (
          <>
            {" ("}
            {minBpm !== mainBpm ? `${minBpm * options.speed}-` : ''}
            {mainBpm * options.speed}
            {mainBpm !== maxBpm ? `-${maxBpm * options.speed}` : ''}
            {")"}
          </>
        ) : (
          `(${240 * options.speed})`
        )}
      </div>
      <div>
        スクロール速度を一定に
        {" "}
        <input type="checkbox" checked={options.constantMode} onChange={onChangeConstantMode} />
      </div>
      <div>
        フリーズも色分けする
        {" "}
        <input type="checkbox" checked={options.colorFreezes} onChange={onChangeColorFreezes} />
      </div>
      <div>
        フリーズの棒部分を控えめに表示
        {" "}
        <input type="checkbox" checked={options.diminishFreezes} onChange={onChangeDiminishFreezes} />
      </div>
      <div>
        低速・高速地帯を色分け
        {" "}
        <input type="checkbox" checked={options.soflanBg} onChange={onChangeSoflanBg} />
      </div>
      <div>
        ソフラン箇所に BPM 値を表示
        {" "}
        <input type="checkbox" checked={options.soflanValue} onChange={onChangeSoflanValue} />
      </div>
      <div>
        ソフラン箇所をハイライト
        {" "}
        <input type="checkbox" checked={options.highlightSoflan} onChange={onChangeHighlightSoflan} />
      </div>
      <div>
        小節線を表示＆メトロノームを再生
        {" "}
        <input type="checkbox" checked={options.tick} onChange={onChangeTick} />
      </div>
      <button onClick={onClose}>[Close]</button>
    </div>
  );
};

const FloatMenu = ({
  style,
  onPlay,
  onPause,
  onOpenOptions,
  playing,
  turn,
  onChangeTurn,
}: {
  style: React.CSSProperties,
  onPlay: () => void,
  onPause: () => void,
  onOpenOptions: () => void,
  playing: boolean,
  turn: Turn,
  onChangeTurn: (newValue: Turn) => void,
}) => {
  const onInputTurn = React.useCallback((e) => (
    onChangeTurn(e.target.value)
  ), [onChangeTurn]);

  const buttonStyle: React.CSSProperties = {
    color: "white",
    fontWeight: "bold",
    backgroundColor: "#ea0",
    borderRadius: "0.75em",
    padding: "0.5em 0.75em",
    border: "none",
    marginRight: "1em",
  };

  return (
    <div style={style}>
      <button onClick={playing ? onPause : onPlay} style={buttonStyle}>
        {playing ? "STOP" : "PLAY"}
      </button>
      <button onClick={onOpenOptions} style={buttonStyle}>
        OPTIONS
      </button>
      <select value={turn} onInput={onInputTurn} style={buttonStyle}>
        {TURNS.map((turn) => (
          <option key={turn.name} value={turn.name}>TURN: {turn.shortName}</option>
        ))}
      </select>
    </div>
  );
}

const PreviewPage = ({ chart }: {
  chart: ChartData,
}) => {
  const [offsetRef, timeRef, playing, start, stop] = usePreview(chart);
  const [showModal, setShowModal] = React.useState(false);
  const [turn, setTurn] = React.useState<Turn>("OFF");

  const [options, setOptions] = React.useState<Options>({
    speed: defaultSpeedFn(chart.meta.mainBpm),
    tick: (
      chart.arrowTimeline.reduce((l, r) => l + (r.beat === 4 ? 1 : 0), 0)
      >= chart.arrowTimeline.length / 4
    ),
    constantMode: false,
    colorFreezes: true,
    diminishFreezes: true,
    soflanBg: true,
    soflanValue: true,
    highlightSoflan: true,
  });

  const closeModal = React.useCallback(() => setShowModal(false), [setShowModal]);
  const openModal = React.useCallback(() => setShowModal(true), [setShowModal]);

  const onPlay = React.useCallback(async () => {
    await prepareAudioContext();
    start();
    setShowModal(false);
  }, [start]);

  const onPause = React.useCallback(() => {
    stop();
    setShowModal(false);
  }, [stop]);

  const controllStyle: React.CSSProperties = {
    position: "absolute",
    padding: 16,
    width: "100vw",
    height: "100vh",
    background: "#ffffff80",
    top: 0,
    left: 0,
  };

  const menuStyle: React.CSSProperties = {
    position: "absolute",
    bottom: "1vw",
    left: "1vw"
  };

  const mainBpm = Math.round(chart.meta.mainBpm);
  const minBpm = Math.round(chart.meta.minBpm);
  const maxBpm = Math.round(chart.meta.maxBpm);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ position: "relative" }}>
        <ChartPreview
            chart={chart}
            speed={options.speed}
            offsetRef={offsetRef}
            timeRef={timeRef}
            playing={playing}
            turn={turn}
            showBeat={options.tick}
            constantMode={options.constantMode}
            colorFreezes={options.colorFreezes}
            diminishFreezes={options.diminishFreezes}
            soflanBg={options.soflanBg}
            soflanValue={options.soflanValue}
            highlightSoflan={options.highlightSoflan} />
        <PreviewSound
            chart={chart}
            offsetRef={offsetRef}
            timeRef={timeRef}
            enableBeatTick={options.tick} />
        <FloatMenu
            style={menuStyle}
            turn={turn}
            playing={playing}
            onChangeTurn={setTurn}
            onPlay={onPlay}
            onPause={onPause}
            onOpenOptions={openModal} />
        { showModal && (
          <OptionsPanel
              options={options}
              onChange={setOptions}
              style={controllStyle}
              minBpm={minBpm}
              mainBpm={mainBpm}
              maxBpm={maxBpm}
              onClose={closeModal} />
        ) }
      </div>
    </div>
  );
};

export default PreviewPage;
