import React from "react";

const ARROW_HEIGHT = 13.5; /* vh */
const LANE_HEIGHT = 100; /* vh */
const HEIGHT_PER_BEAT = (LANE_HEIGHT / 6.25); /* vh */

const ARROW_IMG = {
  4: "/arrow4.svg",
  6: "/arrow6.svg",
  8: "/arrow8.svg",
  12: "/arrow6.svg",
  16: "/arrow16.svg",
  shock: "/arrowShock.svg",
  freeze: "/arrowFreeze.svg",
};

const ARROW_ROTATION = {
  0: "-90deg",
  1: "180deg",
  2: "0",
  3: "90deg",
};

const judgePos = (offset: number, speed: number) => (
  offset * 4 * HEIGHT_PER_BEAT * speed
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

const ChartObjectsRaw = ({ chart, speed = 1 }: {
  chart: Stepchart,
  speed: number,
}) => {
  const lastMeasure = Math.floor(chart.arrows.slice(-1)[0].offset);
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
      {reversedArrows.map((a, i) => (
        <>
          { a.direction.match(/^1.../) &&
            <Arrow key={`a${i}l`} beat={a.beat} direction={0} offset={a.offset} speed={speed} /> }
          { a.direction.match(/^.1../) &&
            <Arrow key={`a${i}d`} beat={a.beat} direction={1} offset={a.offset} speed={speed} /> }
          { a.direction.match(/^..1./) &&
            <Arrow key={`a${i}u`} beat={a.beat} direction={2} offset={a.offset} speed={speed} /> }
          { a.direction.match(/^...1/) &&
            <Arrow key={`a${i}r`} beat={a.beat} direction={3} offset={a.offset} speed={speed} /> }
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
      ))}
      <Spacer offset={lastMeasure + 4} speed={speed} />
    </>
  );
};

const ChartObjects = React.memo(ChartObjectsRaw);

const ChartContainer = ({ offset = 0, speed = 1, children }: {
  offset: number,
  speed: number,
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

  React.useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = judgePos(offset, speed) * window.innerHeight / 100;
    }
  }, [ref, offset, speed]);

  return (
    <div ref={ref} style={style}>
      {children}
    </div>
  );
};

export const ChartPreview = ({ chart, speed = 1, offset = 0 }: {
  chart: Stepchart,
  speed: number,
  offset: number,
}) => {
  return (
    <ChartContainer offset={offset} speed={speed}>
      <ChartObjects chart={chart} speed={speed} />
    </ChartContainer>
  );
};

export default ChartPreview;
