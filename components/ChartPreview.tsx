import React from "react";
import { useAnimationFrame } from "../lib/hooks/useAnimationFrame";
import { makeOffsetToSecConverter } from "../lib/analyzers/timingAnalyzers";
import { TURN_VALUES } from "../constants/turn";

const ARROW_HEIGHT = 13.5; /* vh */
const LANE_HEIGHT = 100; /* vh */
export const LANE_WIDTH = ARROW_HEIGHT * 4; /* vh */

const JUDGE_LINE_POS = ARROW_HEIGHT * 1.25;
const HEIGHT_PER_BEAT = ((LANE_HEIGHT - JUDGE_LINE_POS) / 6.25); /* vh */

const ARROW_IMG = {
  4: "/stepcharts/arrow4.svg",
  6: "/stepcharts/arrow6.svg",
  8: "/stepcharts/arrow8.svg",
  12: "/stepcharts/arrow6.svg",
  16: "/stepcharts/arrow16.svg",
  24: "/stepcharts/arrow6.svg",
  32: "/stepcharts/arrow6.svg",
  64: "/stepcharts/arrow6.svg",
  other: "/stepcharts/arrow6.svg",
  shock: "/stepcharts/arrowShock.svg",
  freeze: "/stepcharts/arrowFreeze.svg",
};

const VERBOSE_ARROW_IMG = {
  4: "/stepcharts/arrow4.svg",
  6: "/stepcharts/arrow6.svg",
  8: "/stepcharts/arrow8.svg",
  12: "/stepcharts/arrow6.svg",
  16: "/stepcharts/arrow16.svg",
  24: "/stepcharts/arrow24.svg",
  32: "/stepcharts/arrow32.svg",
  64: "/stepcharts/arrow64.svg",
  other: "/stepcharts/arrowOther.svg",
  shock: "/stepcharts/arrowShock.svg",
  freeze: "/stepcharts/arrowFreeze.svg",
};

const ARROW_ROTATION = {
  0: "-90deg",
  1: "180deg",
  2: "0",
  3: "90deg",
};

const judgePos = (offset: number, speed: number) => (
  offset * 4 * HEIGHT_PER_BEAT * speed + JUDGE_LINE_POS
);

const Spacer = ({ offset, speed }: {
  offset: number,
  speed: number,
}) => {
  const style: React.CSSProperties = {
    position: "absolute",
    top: `${judgePos(offset, speed)}vh`,
    width: 1,
    height: 1,
  };

  return (
    <div style={style} />
  );
}

const Arrow = ({ beat, direction, pos, highlight = false, verboseColors = false }: {
  beat: Beat | "freeze" | "shock",
  direction: Direction,
  pos: number,
  highlight?: boolean,
  verboseColors?: boolean,
}) => {
  const style: React.CSSProperties = {
    position: "absolute",
    top: `${pos - ARROW_HEIGHT / 2}vh`,
    left: `${direction * ARROW_HEIGHT}vh`,
    height: `${ARROW_HEIGHT}vh`,
    width: `${ARROW_HEIGHT}vh`,
    backgroundImage: `url(${verboseColors ? VERBOSE_ARROW_IMG[beat] : ARROW_IMG[beat]})`,
    backgroundSize: "cover",
    backgroundColor: highlight ? "#fff6" : undefined,
    boxShadow: highlight ? `0 0 ${ARROW_HEIGHT / 4}vh #fff` : undefined,
    borderRadius: `${ARROW_HEIGHT / 2}vh`,
    transform: `rotate(${ARROW_ROTATION[direction]})`,
  };

  return (
    <div style={style} />
  );
};

const Freeze = ({ direction, pos, endPos, diminished }: {
  direction: Direction,
  pos: number,
  endPos: number,
  diminished: boolean,
}) => {
  const bodyStyle: React.CSSProperties = {
    position: "absolute",
    top: `${pos}vh`,
    left: `${direction * ARROW_HEIGHT + ARROW_HEIGHT * 0.05}vh`,
    height: `${endPos - pos}vh`,
    width: `${ARROW_HEIGHT * 0.9}vh`,
    backgroundColor: diminished ? "#88ee4444" : "#88ee44",
  };

  const tailStyle: React.CSSProperties = {
    position: "absolute",
    top: `${endPos}vh`,
    left: `${direction * ARROW_HEIGHT + ARROW_HEIGHT * 0.05}vh`,
    height: 0,
    width: `${ARROW_HEIGHT * 0.9}vh`,
    borderTop: `${ARROW_HEIGHT / 2 * 0.9}vh solid ${diminished ? "#66cc2244" : "#66cc22"}`,
    borderLeft: `${ARROW_HEIGHT / 2 * 0.9}vh solid transparent`,
    borderRight: `${ARROW_HEIGHT / 2 * 0.9}vh solid transparent`,
  };

  return (
    <>
      <div style={bodyStyle} />
      <div style={tailStyle} />
    </>
  );
};

const Bar = ({ pos, endPos, color, bgColor, value }: {
  pos: number,
  endPos?: number,
  color?: string,
  bgColor?: string,
  value?: number
}) => {
  const style: React.CSSProperties = {
    position: "absolute",
    height: `${endPos ? endPos - pos : 0}vh`,
    width: `${LANE_WIDTH}vh`,
    left: 0,
    top: `${pos}vh`,
    borderTop: color ? `4px solid ${color}` : undefined,
    backgroundColor: bgColor,
  };

  const innerStyle: React.CSSProperties = {
    position: "absolute",
    width: "100%",
    color: color,
    textAlign: "center",
    top: "4px",
  };

  return (
    <div style={style}>
      {value && <div style={innerStyle}>{value}</div>}
    </div>
  );
};

const JudgeLine = () => {
  const style: React.CSSProperties = {
    position: "fixed",
    top: `${JUDGE_LINE_POS - ARROW_HEIGHT / 2}vh`,
    pointerEvents: "none",
  };

  const arrowStyle: (rotation: Direction) => React.CSSProperties = (rotation) => ({
    display: "inline-block",
    height: `${ARROW_HEIGHT}vh`,
    width: `${ARROW_HEIGHT}vh`,
    backgroundImage: `url(/stepcharts/arrowJudge.svg)`,
    backgroundSize: "cover",
    transform: `rotate(${ARROW_ROTATION[rotation]})`,
  });

  return (
    <div style={style}>
      <div style={arrowStyle(0)} />
      <div style={arrowStyle(1)} />
      <div style={arrowStyle(2)} />
      <div style={arrowStyle(3)} />
    </div>
  );
};

const posFn = (speed: number, constantMode: boolean) => (e: { time: number, offset: number }) => (
  constantMode ? judgePos(e.time, speed) : judgePos(e.offset, speed)
);

const BeatIndicatorsRaw = ({
  chart,
  speed = 1,
  showBeat,
  constantMode,
  soflanBg,
  soflanValue,
}: {
  chart: AnalyzedStepchart<number>,
  speed: number,
  showBeat: boolean,
  constantMode: boolean,
  soflanBg: boolean,
  soflanValue: boolean,
}) => {
  const toPos = posFn(speed, constantMode);
  const mainBpm = chart.mainBpm;
  return (
    <>
      {showBeat && chart.beatTimeline.map((b, i) => (
        <Bar key={`b${i}`} pos={toPos(b)} color={i % 4 === 0 ? "#fffa" : "#fff5"} />
      ))}
      {chart.bpmTimeline.map((e, i, es) => {
        const end = es[i + 1] ?? chart.beatTimeline[chart.beatTimeline.length - 1];
        return (
          i === 0 ? (
            mainBpm !== e.bpm && (
              <Bar
                  key={`ts${i}`}
                  pos={0}
                  endPos={toPos(end)}
                  color={!soflanValue ? undefined : mainBpm < e.bpm ? "#F6AA00" : "#4DC4FF"}
                  bgColor={!soflanBg ? undefined : mainBpm < e.bpm ? "#F6AA0044" : "#4DC4FF44"}
                  value={soflanValue ? e.bpm : undefined} />
            )
          ) : es[i - 1].bpm < e.bpm ? (
            <Bar
                key={`ts${i}`}
                pos={toPos(e)}
                endPos={mainBpm !== e.bpm ? toPos(end) : undefined}
                color={!soflanValue ? undefined : "#F6AA00"}
                bgColor={!soflanBg ? undefined : mainBpm < e.bpm ? "#F6AA0044" : "#4DC4FF44"}
                value={soflanValue ? e.bpm : undefined} />
          ) : e.bpm < es[i - 1].bpm && e.bpm > 0 ? (
            <Bar
                key={`ts${i}`}
                pos={toPos(e)}
                endPos={mainBpm !== e.bpm ? toPos(end) : undefined}
                color={!soflanValue ? undefined : "#4DC4FF"}
                bgColor={!soflanBg ? undefined : mainBpm < e.bpm ? "#F6AA0044" : "#4DC4FF44"}
                value={soflanValue ? e.bpm : undefined} />
          ) : (
            null
          )
        );
      })}
      {chart.bpmTimeline.map((e, i, es) => (
        e.bpm === 0 ? (
          <Bar
              key={`ts${i}`}
              pos={toPos(e)}
              endPos={toPos(es[i + 1])}
              color={!soflanValue ? undefined : "#FF8082"}
              bgColor={!soflanBg ? undefined : "#FF808244"} />
        ) : (
          null
        )
      ))}
    </>
  );
};

type ArrowCommonProps = {
  beat: Beat | "freeze" | "shock",
  pos: number,
  highlight: boolean,
  verboseColors?: boolean,
};

const ChartObjectsRaw = ({
  chart,
  canonicalChart,
  speed = 1,
  turn = "OFF",
  constantMode,
  colorFreezes,
  diminishFreezes,
  highlightSoflan,
  verboseColors,
  canonicalColors,
}: {
  chart: AnalyzedStepchart<number>,
  canonicalChart: AnalyzedStepchart<number>,
  speed: number,
  turn: Turn,
  constantMode: boolean,
  colorFreezes: boolean,
  diminishFreezes: boolean,
  highlightSoflan: boolean,
  verboseColors: boolean,
  canonicalColors: boolean,
}) => {
  const lastArrow = chart.arrowTimeline[chart.arrowTimeline.length - 1];
  const lastMeasure = Math.floor(lastArrow.offset);
  const toPos = posFn(speed, constantMode);

  const beatFn = (i: number): Beat | "freeze" => (
    chart.arrowTimeline[i].direction.match(/2/) && !colorFreezes ? "freeze" :
    canonicalColors ? canonicalChart.arrowTimeline[i].beat :
    chart.arrowTimeline[i].beat
  );

  return (
    <>
      {chart.freezeTimeline.map((f, i) => (
        <Freeze
            key={`f${i}`}
            direction={TURN_VALUES[turn][f.direction]}
            pos={toPos(f.start)}
            endPos={toPos(f.end)}
            diminished={diminishFreezes} />
      )).reverse()}
      {chart.arrowTimeline.map((a, i) => {
        const props: ArrowCommonProps = {
          beat: "shock",
          highlight: highlightSoflan && !!a.tags.soflanTrigger,
          pos: toPos(a),
        };
        return a.direction === "MMMM" && (
          <>
            <Arrow key={`s${i}l`} direction={TURN_VALUES[turn][0]} {...props} />
            <Arrow key={`s${i}d`} direction={TURN_VALUES[turn][1]} {...props} />
            <Arrow key={`s${i}u`} direction={TURN_VALUES[turn][2]} {...props} />
            <Arrow key={`s${i}r`} direction={TURN_VALUES[turn][3]} {...props} />
          </>
        );
      }).reverse()}
      {chart.arrowTimeline.map((a, i) => a.direction.match(/^..[12]./) && (
        <Arrow
            key={`a${i}u`}
            beat={beatFn(i)}
            direction={TURN_VALUES[turn][2]}
            pos={toPos(a)}
            highlight={highlightSoflan && !!a.tags.soflanTrigger}
            verboseColors={verboseColors} />
      ))}
      {chart.arrowTimeline.map((a, i) => {
        const props: ArrowCommonProps = {
          beat: beatFn(i),
          pos: toPos(a),
          highlight: highlightSoflan && !!a.tags.soflanTrigger,
          verboseColors,
        }
        return (
          <>
            { a.direction.match(/^[12].../) &&
              <Arrow key={`a${i}l`} direction={TURN_VALUES[turn][0]} {...props} /> }
            { a.direction.match(/^.[12]../) &&
              <Arrow key={`a${i}d`} direction={TURN_VALUES[turn][1]} {...props} /> }
            { a.direction.match(/^...[12]/) &&
              <Arrow key={`a${i}r`} direction={TURN_VALUES[turn][3]} {...props} /> }
          </>
        );
      }).reverse()}
      <Spacer offset={lastMeasure + 2} speed={speed} />
    </>
  );
};

const BeatIndicators = React.memo(BeatIndicatorsRaw);
const ChartObjects = React.memo(ChartObjectsRaw);

export const ChartPreview = ({
  chart,
  canonicalChart,
  speed = 1,
  turn = "OFF",
  offsetRef,
  timeRef,
  playing,
  showBeat,
  constantMode = false,
  colorFreezes = false,
  diminishFreezes = false,
  soflanBg = false,
  soflanValue = false,
  highlightSoflan = false,
  verboseColors = false,
  canonicalColors = false,
  children,
}: {
  chart: AnalyzedStepchart<number>,
  canonicalChart: AnalyzedStepchart<number>,
  speed: number,
  turn: Turn,
  offsetRef: React.MutableRefObject<number>,
  timeRef: React.MutableRefObject<number>,
  playing: boolean,
  showBeat: boolean,
  constantMode: boolean,
  colorFreezes: boolean,
  diminishFreezes: boolean,
  soflanBg: boolean,
  soflanValue: boolean,
  highlightSoflan: boolean,
  verboseColors: boolean,
  canonicalColors: boolean,
  children: React.ReactNode,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const laneHeight = React.useMemo(() => {
    if (ref.current && playing) {
      const rect = ref.current.getBoundingClientRect();
      return rect.bottom - rect.top;
    } else {
      return 0;
    }
  }, [ref, playing]);

  const lastOffset = React.useRef<number>();
  const lastTime = React.useRef<number>();
  useAnimationFrame(() => {
    if (ref.current) {
      if (offsetRef.current && offsetRef.current != lastOffset.current) {
        lastOffset.current = offsetRef.current;
        if (!constantMode) {
          ref.current.scrollTop = (
            (judgePos(offsetRef.current, speed) - JUDGE_LINE_POS) * laneHeight / 100
          );
        }
      }
      if (timeRef.current && timeRef.current != lastTime.current) {
        if (constantMode) {
          ref.current.scrollTop = (
            (judgePos(timeRef.current, speed) - JUDGE_LINE_POS) * laneHeight / 100
          );
        }
      }
    }
  }, [ref, offsetRef, timeRef, lastOffset, lastTime, speed, laneHeight, constantMode]);

  const alignContainerStyle: React.CSSProperties = {
    position: "relative",
    width: `${LANE_WIDTH}vh`,
    margin: "auto",
  };

  const scrollContainerStyle: React.CSSProperties = {
    position: "relative",
    overflow: "scroll",
    backgroundColor: "black",
    height: "100vh",
    width: "100vw",
  };

  return (
    <div style={scrollContainerStyle} ref={ref}>
      <div style={alignContainerStyle}>
        <BeatIndicators
            chart={chart}
            speed={speed}
            showBeat={showBeat}
            constantMode={constantMode}
            soflanBg={soflanBg}
            soflanValue={soflanValue} />
        <JudgeLine />
        <ChartObjects
            chart={chart}
            canonicalChart={canonicalChart}
            speed={speed}
            turn={turn}
            constantMode={constantMode}
            colorFreezes={colorFreezes}
            diminishFreezes={diminishFreezes}
            highlightSoflan={highlightSoflan}
            verboseColors={verboseColors}
            canonicalColors={canonicalColors} />
        {children}
      </div>
    </div>
  );
};

export default ChartPreview;
