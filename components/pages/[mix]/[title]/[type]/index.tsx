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
  turn: Turn,
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
  playing,
  onPlay,
  onPause,
  onClose,
}: {
  options: Options,
  onChange: (newValue: Options) => void,
  style: React.CSSProperties,
  minBpm: number,
  mainBpm: number,
  maxBpm: number,
  playing: boolean,
  onPlay: () => void,
  onPause: () => void,
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

  const onChangeTurn = React.useCallback((e) => onChange({
    ...options,
    turn: e.target.value,
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
        TURN:
        {" "}
        <select value={options.turn} onInput={onChangeTurn}>
          {TURNS.map((turn) => <option key={turn} value={turn}>{turn}</option>)}
        </select>
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
      {" "}
      { playing ? (
        <button onClick={onPause}>[STOP]</button>
      ) : (
        <button onClick={onPlay}>[PLAY]</button>
      ) }
    </div>
  );
};

const PreviewPage = ({ chart }: {
  chart: ChartData,
}) => {
  const [offsetRef, timeRef, playing, start, stop] = usePreview(chart);
  const [showModal, setShowModal] = React.useState(false);

  const [options, setOptions] = React.useState<Options>({
    speed: defaultSpeedFn(chart.meta.mainBpm),
    tick: (
      chart.arrowTimeline.reduce((l, r) => l + (r.beat === 4 ? 1 : 0), 0)
      >= chart.arrowTimeline.length / 4
    ),
    turn: "OFF",
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
  };

  const mainBpm = Math.round(chart.meta.mainBpm);
  const minBpm = Math.round(chart.meta.minBpm);
  const maxBpm = Math.round(chart.meta.maxBpm);

  return (
    <div style={{ display: "flex" }}>
      <ChartPreview
          chart={chart}
          speed={options.speed}
          offsetRef={offsetRef}
          timeRef={timeRef}
          playing={playing}
          turn={options.turn}
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
      { showModal && (
        <OptionsPanel
            options={options}
            onChange={setOptions}
            style={controllStyle}
            minBpm={minBpm}
            mainBpm={mainBpm}
            maxBpm={maxBpm}
            playing={playing}
            onPlay={onPlay}
            onPause={onPause}
            onClose={closeModal} />
      ) }
      <button onClick={openModal}>⚙️</button>
    </div>
  );
};

export default PreviewPage;
