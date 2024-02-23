import React from "react";
import ChartPreview, { LANE_WIDTH } from "../../../../ChartPreview";
import PreviewSound from "../../../../PreviewSound";
import { usePreview } from "../../../../../lib/hooks/usePreview";
import { prepareAudioContext } from "../../../../../lib/audioContext";
import { TURNS } from "../../../../../constants/turn";

const defaultSpeedFn = (mainBpm: number) => Math.floor(620 / mainBpm * 4) / 4

const defaultEnableTick = (chart: AnalyzedStepchart<number>) => (
  chart.arrowTimeline.reduce((l, r) => l + (r.beat === 4 ? 1 : 0), 0)
  >= chart.arrowTimeline.length / 4
);

type Options = {
  speed: number,
  turn: Turn,
  tick: boolean,
  constantMode: boolean,
  canonicalMode: boolean,
  colorFreezes: boolean,
  diminishFreezes: boolean,
  soflanBg: boolean,
  soflanValue: boolean,
  highlightSoflan: boolean,
  verboseColors: boolean,
  canonicalColors: boolean,
};

const OptionsPanel = ({
  chart,
  options,
  onChange,
  style,
}: {
  chart: ChartData,
  options: Options,
  onChange: (newValue: Options) => void,
  style: React.CSSProperties,
}) => {
  const onChangeSpeed = React.useCallback((e) => onChange({
    ...options,
    speed: Number(e.target.value),
  }), [options, onChange]);

  const onChangeTurn = React.useCallback((e) => onChange({
    ...options,
    turn: e.target.value,
  }), [options, onChange]);

  const onChangeTick = React.useCallback((e) => onChange({
    ...options,
    tick: e.target.checked,
  }), [options, onChange]);

  const onChangeConstantMode = React.useCallback((e) => onChange({
    ...options,
    constantMode: e.target.checked,
    speed: defaultSpeedFn(e.target.checked ? (
      240
    ) : options.canonicalMode ? (
      chart.canonicalChart.mainBpm
    ) : (
      chart.chart.mainBpm
    )),
  }), [options, onChange]);

  const onChangeCanonicalMode = React.useCallback((e) => onChange({
    ...options,
    canonicalMode: e.target.checked,
    speed: defaultSpeedFn(options.constantMode ? (
      240
    ) : e.target.checked ? (
      chart.canonicalChart.mainBpm
    ) : (
      chart.chart.mainBpm
    )),
    tick: defaultEnableTick(e.target.checked ? chart.canonicalChart : chart.chart),
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

  const onChangeVerboseColors = React.useCallback((e) => onChange({
    ...options,
    verboseColors: e.target.checked,
  }), [options, onChange]);

  const onChangeCanonicalColors = React.useCallback((e) => onChange({
    ...options,
    canonicalColors: e.target.checked,
  }), [options, onChange]);

  const { minBpm, mainBpm, maxBpm } = options.canonicalMode ? chart.canonicalChart : chart.chart;

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
        <label>
          スクロール速度を一定に
          {" "}
          <input type="checkbox" checked={options.constantMode} onChange={onChangeConstantMode} />
        </label>
      </div>
      <div>
        TURN:
        {" "}
        <select value={options.turn} onInput={onChangeTurn}>
          {TURNS.map((turn) => (
            <option key={turn.name} value={turn.name}>TURN: {turn.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label>
          フリーズも色分けする
          {" "}
          <input type="checkbox" checked={options.colorFreezes} onChange={onChangeColorFreezes} />
        </label>
      </div>
      <div>
        <label>
          フリーズの棒部分を控えめに表示
          {" "}
          <input type="checkbox" checked={options.diminishFreezes} onChange={onChangeDiminishFreezes} />
        </label>
      </div>
      <div>
        <label>
          低速・高速地帯を色分け
          {" "}
          <input type="checkbox" checked={options.soflanBg} onChange={onChangeSoflanBg} />
        </label>
      </div>
      <div>
        <label>
          ソフラン箇所に目印を表示
          {" "}
          <input type="checkbox" checked={options.soflanValue} onChange={onChangeSoflanValue} />
        </label>
      </div>
      <div>
        <label>
          ソフラン直前のノートをハイライト
          {" "}
          <input type="checkbox" checked={options.highlightSoflan} onChange={onChangeHighlightSoflan} />
        </label>
      </div>
      <div>
        <label>
          24 分以下のノートも色分け
          {" "}
          <input type="checkbox" checked={options.verboseColors} onChange={onChangeVerboseColors} />
        </label>
      </div>
      <div>
        <label>
          小節線を表示＆メトロノームを再生
          {" "}
          <input type="checkbox" checked={options.tick} onChange={onChangeTick} />
        </label>
      </div>
      <div>
        <label>
          色分けをソフランに追従（β：一部の譜面で非対応）
          {" "}
          <input type="checkbox" checked={options.canonicalColors} onChange={onChangeCanonicalColors} />
        </label>
      </div>
      <div>
        <label>
          show canonical chart（※デバッグ用）
          {" "}
          <input type="checkbox" checked={options.canonicalMode} onChange={onChangeCanonicalMode} />
        </label>
      </div>
    </div>
  );
};

const FloatMenu = ({
  onPlay,
  onPause,
  onOpenOptions,
  onCloseOptions,
  playing,
  opened,
}: {
  onPlay: () => void,
  onPause: () => void,
  onOpenOptions: () => void,
  onCloseOptions: () => void,
  playing: boolean,
  opened: boolean,
}) => {
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
    <div>
      <button onClick={playing ? onPause : onPlay} style={buttonStyle}>
        {playing ? "STOP" : "PLAY"}
      </button>
      <button onClick={opened ? onCloseOptions : onOpenOptions} style={buttonStyle}>
        {opened ? "x CLOSE" : "OPTIONS"}
      </button>
    </div>
  );
}

const PreviewPage = ({ chart }: {
  chart: ChartData,
}) => {
  const [showModal, setShowModal] = React.useState(false);

  const [options, setOptions] = React.useState<Options>({
    speed: defaultSpeedFn(chart.chart.mainBpm),
    turn: "OFF",
    tick: defaultEnableTick(chart.chart),
    constantMode: false,
    colorFreezes: true,
    diminishFreezes: true,
    soflanBg: true,
    soflanValue: true,
    highlightSoflan: true,
    verboseColors: true,
    canonicalColors: false,
    canonicalMode: false,
  });

  const [offsetRef, timeRef, playing, start, stop] = usePreview(
    options.canonicalMode ? chart.canonicalChart : chart.chart
  );

  const closeModal = React.useCallback(() => setShowModal(false), [setShowModal]);
  const openModal = React.useCallback(() => setShowModal(true), [setShowModal]);

  const onPlay = React.useCallback(async () => {
    await prepareAudioContext();
    start();
  }, [start]);

  const panelStyle: React.CSSProperties = {
    textAlign: "left",
    padding: "1em",
    marginBottom: "1em",
    background: "#ffffffa0",
    lineHeight: "2",
  };

  const controlStyle: React.CSSProperties = {
    position: "fixed",
    textAlign: "center",
    bottom: "1em",
    width: `${LANE_WIDTH}vh`,
  };

  return (
    <>
      <ChartPreview
          chart={options.canonicalMode ? chart.canonicalChart : chart.chart}
          canonicalChart={chart.canonicalChart}
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
          highlightSoflan={options.highlightSoflan}
          verboseColors={options.verboseColors}
          canonicalColors={options.canonicalColors}>
        <div style={controlStyle}>
          { showModal && (
            <OptionsPanel
                chart={chart}
                options={options}
                onChange={setOptions}
                style={panelStyle} />
          ) }
          <FloatMenu
              playing={playing}
              opened={showModal}
              onPlay={onPlay}
              onPause={stop}
              onOpenOptions={openModal}
              onCloseOptions={closeModal} />
        </div>
      </ChartPreview>
      <PreviewSound
          chart={options.canonicalMode ? chart.canonicalChart : chart.chart}
          timeRef={timeRef}
          enableBeatTick={options.tick} />
    </>
  );
};

export default PreviewPage;
