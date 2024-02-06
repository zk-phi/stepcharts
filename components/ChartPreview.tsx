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

const Arrow = ({ beat, direction, pos, highlight = false }: {
  beat: Beat | "freeze" | "shock",
  direction: Direction,
  pos: number,
  highlight?: boolean,
}) => {
  const style: React.CSSProperties = {
    position: "absolute",
    top: `${pos - ARROW_HEIGHT / 2}vh`,
    left: `${direction * ARROW_HEIGHT}vh`,
    height: `${ARROW_HEIGHT}vh`,
    width: `${ARROW_HEIGHT}vh`,
    backgroundImage: `url(${ARROW_IMG[beat]})`,
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
  color: string,
  bgColor?: string,
  value?: number
}) => {
  const style: React.CSSProperties = {
    position: "absolute",
    height: `${endPos ? endPos - pos : 0}vh`,
    width: `${LANE_WIDTH}vh`,
    left: 0,
    top: `${pos}vh`,
    borderTop: `4px solid ${color}`,
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
    height: 0,
    width: `${LANE_WIDTH}vh`,
    top: `${JUDGE_LINE_POS - ARROW_HEIGHT / 2}vh`,
    border: `${ARROW_HEIGHT / 2}vh solid #ffffff60`,
    pointerEvents: "none",
  };

  return (
    <div style={style} />
  );
};

const ChartObjectsRaw = ({
  chart,
  speed = 1,
  turn = "OFF",
  showBeat,
  constantMode,
  colorFreezes,
  diminishFreezes,
  soflanBg,
  soflanValue,
  highlightSoflan,
}: {
  chart: ChartData,
  speed: number,
  turn: Turn,
  showBeat: boolean,
  constantMode: boolean,
  colorFreezes: boolean,
  diminishFreezes: boolean,
  soflanBg: boolean,
  soflanValue: boolean,
  highlightSoflan: boolean,
}) => {
  const lastArrow = chart.arrowTimeline[chart.arrowTimeline.length - 1];
  const lastMeasure = Math.floor(lastArrow.offset);
  const endTime = lastArrow.time + 1;
  const reversedArrows = [...chart.arrowTimeline].reverse();
  const reversedFreezes = [...chart.freezeTimeline].reverse();

  const posFn = (e: { time: number, offset: number }) => (
    constantMode ? judgePos(e.time, speed) : judgePos(e.offset, speed)
  );

  return (
    <>
      {showBeat && chart.beatTimeline.map((b, i) => (
        <Bar key={`b${i}`} pos={posFn(b)} color={i % 4 === 0 ? "#fffa" : "#fff5"} />
      ))}
      {chart.bpmTimeline.map((e, i, es) => {
        const end = es[i + 1] ?? chart.beatTimeline[chart.beatTimeline.length - 1];
        return (
          i === 0 ? (
            chart.meta.mainBpm !== e.bpm && (
              <Bar
                  key={`ts${i}`}
                  pos={0}
                  endPos={posFn(end)}
                  color={chart.meta.mainBpm < e.bpm ? "#fc4" : "#4cf"}
                  bgColor={!soflanBg ? undefined : chart.meta.mainBpm < e.bpm ? "#fc44" : "#4cf4"}
                  value={soflanValue ? e.bpm : undefined} />
            )
          ) : es[i - 1].bpm < e.bpm ? (
            <Bar
                key={`ts${i}`}
                pos={posFn(e)}
                endPos={chart.meta.mainBpm !== e.bpm ? posFn(end) : undefined}
                color={"#fc4"}
                bgColor={!soflanBg ? undefined : chart.meta.mainBpm < e.bpm ? "#fc44" : "#4cf4"}
                value={soflanValue ? e.bpm : undefined} />
          ) : e.bpm < es[i - 1].bpm && e.bpm > 0 ? (
            <Bar
                key={`ts${i}`}
                pos={posFn(e)}
                endPos={chart.meta.mainBpm !== e.bpm ? posFn(end) : undefined}
                color={"#4cf"}
                bgColor={!soflanBg ? undefined : chart.meta.mainBpm < e.bpm ? "#fc44" : "#4cf4"}
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
              pos={posFn(e)}
              endPos={posFn(es[i + 1])}
              color={"#4f4"}
              bgColor={"#4f44"} />
        ) : (
          null
        )
      ))}
      {reversedFreezes.map((f, i) => {
        const direction = TURN_VALUES[turn][f.direction];
        return (
          <Freeze
              key={`f${i}`}
              direction={direction}
              pos={posFn(f.start)}
              endPos={posFn(f.end)}
              diminished={diminishFreezes} />
        );
      })}
      {reversedArrows.map((a, i) => {
        const isFreeze = a.direction.match(/2/);
        const beat = isFreeze && !colorFreezes ? "freeze" : a.beat;
        const pos = posFn(a);
        return (
          <>
            { a.direction.match(/^[12].../) &&
              <Arrow
                  key={`a${i}l`}
                  beat={beat}
                  direction={TURN_VALUES[turn][0]}
                  pos={pos}
                  highlight={highlightSoflan && !!a.tags.soflanTrigger} /> }
            { a.direction.match(/^.[12]../) &&
              <Arrow
                  key={`a${i}d`}
                  beat={beat}
                  direction={TURN_VALUES[turn][1]}
                  pos={pos}
                  highlight={highlightSoflan && !!a.tags.soflanTrigger} /> }
            { a.direction.match(/^..[12]./) &&
              <Arrow
                  key={`a${i}u`}
                  beat={beat}
                  direction={TURN_VALUES[turn][2]}
                  pos={pos}
                  highlight={highlightSoflan && !!a.tags.soflanTrigger} /> }
            { a.direction.match(/^...[12]/) &&
              <Arrow
                  key={`a${i}r`}
                  beat={beat}
                  direction={TURN_VALUES[turn][3]}
                  pos={pos}
                  highlight={highlightSoflan && !!a.tags.soflanTrigger} /> }
            { a.direction.match(/^M.../) &&
              <Arrow
                  key={`a${i}l`}
                  beat="shock"
                  direction={TURN_VALUES[turn][0]}
                  pos={pos}
                  highlight={highlightSoflan && !!a.tags.soflanTrigger} /> }
            { a.direction.match(/^.M../) &&
              <Arrow
                  key={`a${i}d`}
                  beat="shock"
                  direction={TURN_VALUES[turn][1]}
                  pos={pos}
                  highlight={highlightSoflan && !!a.tags.soflanTrigger} /> }
            { a.direction.match(/^..M./) &&
              <Arrow
                  key={`a${i}u`}
                  beat="shock"
                  direction={TURN_VALUES[turn][2]}
                  pos={pos}
                  highlight={highlightSoflan && !!a.tags.soflanTrigger} /> }
            { a.direction.match(/^...M/) &&
              <Arrow
                  key={`a${i}r`}
                  beat="shock"
                  direction={TURN_VALUES[turn][3]}
                  pos={pos}
                  highlight={highlightSoflan && !!a.tags.soflanTrigger} /> }
          </>
        );
      })}
      <Spacer offset={lastMeasure + 2} speed={speed} />
    </>
  );
};

const ChartObjects = React.memo(ChartObjectsRaw);

export const ChartPreview = ({
  chart,
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
  children,
}: {
  chart: ChartData,
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
        <ChartObjects
            chart={chart}
            speed={speed}
            turn={turn}
            showBeat={showBeat}
            constantMode={constantMode}
            colorFreezes={colorFreezes}
            diminishFreezes={diminishFreezes}
            soflanBg={soflanBg}
            soflanValue={soflanValue}
            highlightSoflan={highlightSoflan} />
        <JudgeLine />
        {children}
      </div>
    </div>
  );
};

export default ChartPreview;
