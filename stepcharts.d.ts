type Arrow = {
  // other beats such as 5ths and 32nds end up being colored
  // the same as 6ths. This probably should be "color" not "beat" TODO
  beat: 4 | 6 | 8 | 12 | 16;
  direction:
    | `${0 | 1 | 2}${0 | 1 | 2}${0 | 1 | 2}${0 | 1 | 2}`
    | `${0 | 1 | 2}${0 | 1 | 2}${0 | 1 | 2}${0 | 1 | 2}${0 | 1 | 2}${
        | 0
        | 1
        | 2}${0 | 1 | 2}${0 | 1 | 2}`;
  offset: number;
};

type FreezeBody = {
  direction: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  startOffset: number;
  endOffset: number;
};

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

type Simfile = {
  title: Title;
  artist: string;
  mix: Mix;
  availableTypes: StepchartType[];
  charts: Record<string, Stepchart>;
  minBpm: number;
  maxBpm: number;
  displayBpm: string;
  stopCount: number;
};

type Mix = {
  mixName: string;
  mixDir: string;
  songCount: number;
  yearReleased: number;
  banner: string | null;
};

type Title = {
  titleName: string;
  translitTitleName: string | null;
  titleDir: string;
  banner: string | null;
};

type SongDifficultyType = {
  title: Title;
  mix: Mix;
  type: StepchartType;
};
