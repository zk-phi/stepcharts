import React from "react";
import { useAnimationFrame } from "../lib/hooks/useAnimationFrame";
import { makeOffsetToSecConverter } from "../lib/analyzers/timingAnalyzers";
import { TURN_VALUES } from "../constants/turn";

const ARROW_HEIGHT = 13.5; /* vh */
const LANE_HEIGHT = 100; /* vh */
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

const Arrow = ({ beat, direction, pos }: {
  beat: Beat | "freeze" | "shock",
  direction: Direction,
  pos: number,
}) => {
  const style: React.CSSProperties = {
    position: "absolute",
    top: `${pos - ARROW_HEIGHT / 2}vh`,
    left: `${direction * ARROW_HEIGHT}vh`,
    height: `${ARROW_HEIGHT}vh`,
    width: `${ARROW_HEIGHT}vh`,
    background: `url(${ARROW_IMG[beat]})`,
    backgroundSize: "cover",
    transform: `rotate(${ARROW_ROTATION[direction]})`,
  };

  return (
    <div style={style} />
  );
};

const Freeze = ({ direction, pos, endPos }: {
  direction: Direction,
  pos: number,
  endPos: number,
}) => {
  const bodyStyle: React.CSSProperties = {
    position: "absolute",
    top: `${pos}vh`,
    left: `${direction * ARROW_HEIGHT + ARROW_HEIGHT * 0.05}vh`,
    height: `${endPos - pos}vh`,
    width: `${ARROW_HEIGHT * 0.9}vh`,
    backgroundColor: "#5e5",
  };

  const tailStyle: React.CSSProperties = {
    position: "absolute",
    top: `${endPos}vh`,
    left: `${direction * ARROW_HEIGHT + ARROW_HEIGHT * 0.05}vh`,
    height: 0,
    width: `${ARROW_HEIGHT * 0.9}vh`,
    borderTop: `${ARROW_HEIGHT / 2 * 0.9}vh solid #3b3`,
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

const Bar = ({ pos, endPos, color, bgColor }: {
  pos: number,
  endPos?: number,
  color: string,
  bgColor: string,
}) => {
  const style: React.CSSProperties = {
    position: "absolute",
    height: `${endPos ? endPos - pos : 0}vh`,
    width: `${4 * ARROW_HEIGHT}vh`,
    left: 0,
    top: `${pos}vh`,
    borderTop: `4px solid ${color}`,
    background: bgColor,
  };

  return (
    <div style={style} />
  );
};

const JudgeLine = () => {
  const style: React.CSSProperties = {
    position: "absolute",
    height: 0,
    width: `${4 * ARROW_HEIGHT}vh`,
    left: 0,
    top: `${JUDGE_LINE_POS - ARROW_HEIGHT / 2}vh`,
    border: `${ARROW_HEIGHT / 2}vh solid #ffffff60`,
  };

  return (
    <div style={style} />
  );
};

const ChartObjectsRaw = ({ chart, speed = 1, turn = "OFF", showBeat, constantMode }: {
  chart: ChartData,
  speed: number,
  turn: Turn,
  showBeat: boolean,
  constantMode: boolean,
}) => {
  const lastArrow = chart.arrowTimeline[chart.arrowTimeline.length - 1];
  const lastMeasure = Math.floor(lastArrow.offset);
  const endTime = lastArrow.time + 1;
  const reversedArrows = [...chart.arrowTimeline].reverse();
  const reversedFreezes = [...chart.freezeTimeline].reverse();

  const posFn = (e: { time: number, offset: number }) => (
    constantMode ? judgePos(e.time, speed) : judgePos(e.offset, speed)
  );

  const beats = !showBeat ? [] : (() => {
    const converter = makeOffsetToSecConverter(chart.bpmTimeline);
    return [...Array((lastMeasure + 1) * 4)].map((_, i) => ({
      offset: i / 4,
      time: converter(i / 4),
    }))
  })();

  return (
    <>
      {beats.map((b, i) => (
        <Bar key={`b${i}`} pos={posFn(b)} color={i % 4 === 0 ? "#fffa" : "#fff5"} />
      ))}
      {chart.bpmTimeline.map((e, i, es) => (
        i === 0 ? (
          null
        ) : e.bpm === 0 ? (
          <Bar
              key={`ts${i}`}
              pos={posFn(e)}
              endPos={posFn(chart.bpmTimeline[i + 1])}
              color={"#4f4"}
              bgColor={"#4f44"} />
        ) : es[i - 1].bpm === 0 ? (
          null
        ) : es[i - 1].bpm < e.bpm ? (
          <Bar key={`ts${i}`} pos={posFn(e)} color={"#fc4"} />
        ) : (
          <Bar key={`ts${i}`} pos={posFn(e)} color={"#4cf"} />
        )
      ))}
      {reversedFreezes.map((f, i) => {
        const direction = TURN_VALUES[turn][f.direction];
        return (
          <Freeze key={`f${i}`} direction={direction} pos={posFn(f.start)} endPos={posFn(f.end)} />
        );
      })}
      {reversedArrows.map((a, i) => {
        const isFreeze = a.direction.match(/2/);
        const beat = isFreeze ? "freeze" : a.beat;
        const pos = posFn(a);
        return (
          <>
            { a.direction.match(/^1.../) &&
              <Arrow key={`a${i}l`} beat={beat} direction={TURN_VALUES[turn][0]} pos={pos} /> }
            { a.direction.match(/^.1../) &&
              <Arrow key={`a${i}d`} beat={beat} direction={TURN_VALUES[turn][1]} pos={pos} /> }
            { a.direction.match(/^..1./) &&
              <Arrow key={`a${i}u`} beat={beat} direction={TURN_VALUES[turn][2]} pos={pos} /> }
            { a.direction.match(/^...1/) &&
              <Arrow key={`a${i}r`} beat={beat} direction={TURN_VALUES[turn][3]} pos={pos} /> }
            { a.direction.match(/^2.../) &&
              <Arrow key={`a${i}l`} beat="freeze" direction={TURN_VALUES[turn][0]} pos={pos} /> }
            { a.direction.match(/^.2../) &&
              <Arrow key={`a${i}d`} beat="freeze" direction={TURN_VALUES[turn][1]} pos={pos} /> }
            { a.direction.match(/^..2./) &&
              <Arrow key={`a${i}u`} beat="freeze" direction={TURN_VALUES[turn][2]} pos={pos} /> }
            { a.direction.match(/^...2/) &&
              <Arrow key={`a${i}r`} beat="freeze" direction={TURN_VALUES[turn][3]} pos={pos} /> }
            { a.direction.match(/^M.../) &&
              <Arrow key={`a${i}l`} beat="shock" direction={TURN_VALUES[turn][0]} pos={pos} /> }
            { a.direction.match(/^.M../) &&
              <Arrow key={`a${i}d`} beat="shock" direction={TURN_VALUES[turn][1]} pos={pos} /> }
            { a.direction.match(/^..M./) &&
              <Arrow key={`a${i}u`} beat="shock" direction={TURN_VALUES[turn][2]} pos={pos} /> }
            { a.direction.match(/^...M/) &&
              <Arrow key={`a${i}r`} beat="shock" direction={TURN_VALUES[turn][3]} pos={pos} /> }
          </>
        );
      })}
      <Spacer offset={lastMeasure + 2} speed={speed} />
    </>
  );
};

const ChartObjects = React.memo(ChartObjectsRaw);

const ChartContainer = ({
  offsetRef,
  timeRef,
  speed = 1,
  playing,
  constantMode,
  children,
}: {
  timeRef: React.MutableRefObject<number>,
  offsetRef: React.MutableRefObject<number>,
  speed: number,
  playing: boolean,
  constantMode: boolean,
  children: React.ReactNode,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const style: React.CSSProperties = {
    position: "relative",
    width: `${4 * ARROW_HEIGHT}vh`,
    height: `100vh`,
    backgroundColor: "black",
    overflow: "scroll",
  };

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

  return (
    <div ref={ref} style={style}>
      {children}
    </div>
  );
};

export const ChartPreview = ({
  chart,
  speed = 1,
  turn = "OFF",
  offsetRef,
  timeRef,
  playing,
  showBeat,
  constantMode = false,
}: {
  chart: ChartData,
  speed: number,
  turn: Turn,
  offsetRef: React.MutableRefObject<number>,
  timeRef: React.MutableRefObject<number>,
  playing: boolean,
  showBeat: boolean,
  constantMode: boolean,
}) => {
  return (
    <div style={{ position: "relative" }}>
      <ChartContainer
          offsetRef={offsetRef}
          timeRef={timeRef}
          speed={speed}
          playing={playing}
          constantMode={constantMode}>
        <ChartObjects
            chart={chart}
            speed={speed}
            turn={turn}
            showBeat={showBeat}
            constantMode={constantMode} />
      </ChartContainer>
      <JudgeLine />
    </div>
  );
};

export default ChartPreview;
