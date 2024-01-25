type Difficulty =
  | "beginner"
  | "basic"
  | "difficult"
  | "expert"
  | "challenge"
  | "edit";

type MixMeta = {
  mixId: string;
  name: string;
  shortName: string;
  year: number;
  songs: number;
};

type SongMeta = {
  songId: string;
  title: string;
  titleTranslit: string | null;
  artist: string;
  displayBpm: string;
};

type ChartMeta = Stats & {
  difficulty: Difficulty,
  level: number;
  arrows: number;
  stops: number;
  bpmShifts: number;
  minBpm: number;
  maxBpm: number;
  mainBpm: number;
  complexity: number;
};

type BpmEvent = {
  time: number;
  offset: number;
  bpm: number;
};

type ArrowEvent = Arrow & {
  time: number,
};

type AllMeta = MixMeta & SongMeta & ChartMeta & { filterString: string };
type AnalyzedStepchart = {
  freezes: FreezeBody[];
  arrowTimeline: ArrowEvent[];
  bpmTimeline: BpmEvent[];
};
type ChartData = AnalyzedStepchart & {
  meta: AllMeta,
};

type Index = {
  id: string,
  songs: {
    id: string,
    charts: {
      difficulty: string;
    }[],
  }[]
}[];
