import React from "react";
import { useAnimationFrame } from "../../../../../lib/hooks/useAnimationFrame";

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

const Arrow = ({ beat, direction, offset, speed }: {
  beat: 4 | 6 | 8 | 12 | 16 | "freeze" | "shock",
  direction: 0 | 1 | 2 | 3,
  offset: number,
  speed: number,
}) => {
  const style: React.CSSProperties = {
    position: "absolute",
    top: `${judgePos(offset, speed) - ARROW_HEIGHT / 2}vh`,
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

const Freeze = ({ direction, offset, endOffset, speed }: {
  direction: 0 | 1 | 2 | 3,
  offset: number,
  endOffset: number,
  speed: number,
}) => {
  const bodyStyle: React.CSSProperties = {
    position: "absolute",
    top: `${judgePos(offset, speed)}vh`,
    left: `${direction * ARROW_HEIGHT + ARROW_HEIGHT * 0.05}vh`,
    height: `${(endOffset - offset - 0.25) * 4 * speed * HEIGHT_PER_BEAT}vh`,
    width: `${ARROW_HEIGHT * 0.9}vh`,
    backgroundColor: "#5e5",
  };

  /* const tailStyle = {
   *   position: "absolute",
   *   top: `${judgePos(endOffset - 0.25, speed)}vh`,
   *   left: `${direction * ARROW_HEIGHT + ARROW_HEIGHT * 0.05}vh`,
   *   height: 0,
   *   width: `${ARROW_HEIGHT * 0.9}vh`,
   *   borderTop: `${ARROW_HEIGHT / 2 * 0.9}vh solid #3b3`,
   *   borderLeft: `${ARROW_HEIGHT / 2 * 0.9}vh solid transparent`,
   *   borderRight: `${ARROW_HEIGHT / 2 * 0.9}vh solid transparent`,
   * }; */

  const tailStyle: React.CSSProperties = {
    position: "absolute",
    top: `${judgePos(endOffset - 0.25, speed)}vh`,
    left: `${direction * ARROW_HEIGHT + ARROW_HEIGHT * 0.05}vh`,
    height: `${ARROW_HEIGHT / 2 * 0.9}vh`,
    width: `${ARROW_HEIGHT * 0.9}vh`,
    backgroundColor: "#3b3",
  };

  return (
    <>
      <div style={bodyStyle} />
      <div style={tailStyle} />
    </>
  );
};

const Bar = ({ offset, speed, color }: {
  offset: number,
  speed: number,
  color: string,
}) => {
  const style: React.CSSProperties = {
    position: "absolute",
    height: 0,
    width: `${4 * ARROW_HEIGHT}vh`,
    left: 0,
    top: `${judgePos(offset, speed)}vh`,
    border: `2px solid ${color}`,
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

const ChartObjectsRaw = ({ chart, speed = 1 }: {
  chart: Stepchart,
  speed: number,
}) => {
  const lastMeasure = Math.floor(chart.arrows[chart.arrows.length - 1].offset);
  const reversedArrows = [...chart.arrows].reverse();
  const reversedFreezes = [...chart.freezes].reverse();

  return (
    <>
      {[...Array((lastMeasure + 1) * 4)].map((_, i) => (
        <Bar key={`b${i}`} offset={i / 4} speed={speed} color={i % 4 === 0 ? "#888" : "#444"} />
      ))}
      {chart.bpm.map((b, i, bs) => (
        i === 0 ? (
          null
        ) : bs[i - 1].bpm < b.bpm ? (
          <Bar key={`ts${i}`} offset={b.startOffset} speed={speed} color={"#fc4"} />
        ) : (
          <Bar key={`ts${i}`} offset={b.startOffset} speed={speed} color={"#4cf"} />
        )
      ))}
      {chart.stops.map((s, i) => (
        <Bar key={`s${i}`} offset={s.offset} speed={speed} color={"#4f4"} />
      ))}
      {reversedFreezes.map((f, i) => (
        <Freeze
            key={`f${i}`}
            direction={f.direction}
            offset={f.startOffset}
            endOffset={f.endOffset}
            speed={speed} />
      ))}
      {reversedArrows.map((a, i) => {
        const isFreeze = a.direction.match(/2/);
        const beat = isFreeze ? "freeze" : a.beat;
        return (
          <>
            { a.direction.match(/^1.../) &&
              <Arrow key={`a${i}l`} beat={beat} direction={0} offset={a.offset} speed={speed} /> }
            { a.direction.match(/^.1../) &&
              <Arrow key={`a${i}d`} beat={beat} direction={1} offset={a.offset} speed={speed} /> }
            { a.direction.match(/^..1./) &&
              <Arrow key={`a${i}u`} beat={beat} direction={2} offset={a.offset} speed={speed} /> }
            { a.direction.match(/^...1/) &&
              <Arrow key={`a${i}r`} beat={beat} direction={3} offset={a.offset} speed={speed} /> }
            { a.direction.match(/^2.../) &&
              <Arrow key={`a${i}l`} beat="freeze" direction={0} offset={a.offset} speed={speed} /> }
            { a.direction.match(/^.2../) &&
              <Arrow key={`a${i}d`} beat="freeze" direction={1} offset={a.offset} speed={speed} /> }
            { a.direction.match(/^..2./) &&
              <Arrow key={`a${i}u`} beat="freeze" direction={2} offset={a.offset} speed={speed} /> }
            { a.direction.match(/^...2/) &&
              <Arrow key={`a${i}r`} beat="freeze" direction={3} offset={a.offset} speed={speed} /> }
            { a.direction.match(/^M.../) &&
              <Arrow key={`a${i}l`} beat="shock" direction={0} offset={a.offset} speed={speed} /> }
            { a.direction.match(/^.M../) &&
              <Arrow key={`a${i}d`} beat="shock" direction={1} offset={a.offset} speed={speed} /> }
            { a.direction.match(/^..M./) &&
              <Arrow key={`a${i}u`} beat="shock" direction={2} offset={a.offset} speed={speed} /> }
            { a.direction.match(/^...M/) &&
              <Arrow key={`a${i}r`} beat="shock" direction={3} offset={a.offset} speed={speed} /> }
          </>
        );
      })}
      <Spacer offset={lastMeasure + 2} speed={speed} />
    </>
  );
};

const ChartObjects = React.memo(ChartObjectsRaw);

const ChartContainer = ({ offsetRef, speed = 1, playing, children }: {
  offsetRef: React.MutableRefObject<number>,
  speed: number,
  playing: boolean,
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
  const handler = React.useCallback(() => {
    if (ref.current && offsetRef.current && offsetRef.current != lastOffset.current) {
      ref.current.scrollTop = (
        (judgePos(offsetRef.current, speed) - JUDGE_LINE_POS) * laneHeight / 100
      );
      lastOffset.current = offsetRef.current;
    }
  }, [ref, offsetRef, lastOffset, speed, laneHeight]);

  useAnimationFrame(handler);

  return (
    <div ref={ref} style={style}>
      {children}
    </div>
  );
};

export const ChartPreview = ({ chart, speed = 1, offsetRef, playing }: {
  chart: Stepchart,
  speed: number,
  offsetRef: React.MutableRefObject<number>,
  playing: boolean,
}) => {
  return (
    <div style={{ position: "relative" }}>
      <ChartContainer offsetRef={offsetRef} speed={speed} playing={playing}>
        <ChartObjects chart={chart} speed={speed} />
      </ChartContainer>
      <JudgeLine />
    </div>
  );
};

export default ChartPreview;
