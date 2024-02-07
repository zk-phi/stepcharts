type Difficulty =
  | "beginner"
  | "basic"
  | "difficult"
  | "expert"
  | "challenge"
  | "edit";

type StepchartType = {
  difficulty: Difficulty;
  feet: number;
};

type Stats = {
  jumps: number;
  jacks: number;
  freezes: number;
  gallops: number;
  shocks: number;
  sixteenths: number;
  trips: number;
};

type Arrow = {
  // other beats such as 5ths and 32nds end up being colored
  // the same as 6ths. This probably should be "color" not "beat" TODO
  beat: Beat;
  direction: `${0 | 1 | 2}${0 | 1 | 2}${0 | 1 | 2}${0 | 1 | 2}` | 'MMMM';
  offset: Fraction;
};

type FreezeBody = {
  direction: 0 | 1 | 2 | 3;
  startOffset: Fraction;
  endOffset: Fraction;
};

type Bpm = {
  startOffset: Fraction;
  endOffset: Fraction | null;
  bpm: Fraction;
};

type Stop = {
  offset: Fraction;
  duration: Fraction;
};

type Stepchart = {
  arrows: Arrow[];
  freezes: FreezeBody[];
  bpm: Bpm[];
  stops: Stop[];
};

type Simfile = {
  title: Title;
  artist: string;
  availableTypes: StepchartType[];
  charts: Record<string, Stepchart>;
};
