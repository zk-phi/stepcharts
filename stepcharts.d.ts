type Arrow = {
  // other beats such as 5ths and 32nds end up being colored
  // the same as 6ths. This probably should be "color" not "beat" TODO
  beat: 4 | 6 | 8 | 12 | 16;
  direction: `${0 | 1 | 2}${0 | 1 | 2}${0 | 1 | 2}${0 | 1 | 2}`;
  offset: number;
};

type FreezeBody = {
  direction: 0 | 1 | 2 | 3;
  startOffset: number;
  endOffset: number;
};

type Bpm = {
  startOffset: number;
  endOffset: number | null;
  bpm: number;
};

type Stop = {
  offset: number;
  duration: number;
};

type Stepchart = {
  arrows: Arrow[];
  freezes: FreezeBody[];
  bpm: Bpm[];
  stops: Stop[];
};

type Stats = {
  jumps: number;
  jacks: number;
  freezes: number;
  gallops: number;
};
