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
  filterString: string;
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

type AllMeta = MixMeta & SongMeta & ChartMeta;


type Timestamp<T extends Fraction | number> = {
  time: T;
  offset: T;
};

// stops and bpm-changes with both timing and offset values
type BpmEvent<T extends Fraction | number> = { bpm: T } & Timestamp<T>;

// arrows with both timing and offset values
type ArrowEvent<T extends Fraction | number> =
  Omit<Arrow, "offset"> & Timestamp<T>;

type FreezeEvent<T extends Fraction | number> =
  Omit<FreezeBody, "startOffset" | "endOffset"> & { start: Timestamp<T>, end: Timestamp<T> };

type AnalyzedStepchart<T extends Fraction | number> = {
  freezeTimeline: FreezeEvent<T>[];
  arrowTimeline: ArrowEvent<T>[];
  bpmTimeline: BpmEvent<T>[];
  beatTimeline: Timestamp<T>[];
};


type ChartData = AnalyzedStepchart<number> & {
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
