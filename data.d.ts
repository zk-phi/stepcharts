type ArrowTag =
  "soflanTrigger" | "jump" | "shock" | "freeze" | "backbeat" | "gallop" | "offbeat" | "trip";

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
  jumps: number;
  freezes: number;
  bpmShifts: number;
  minBpm: number;
  maxBpm: number;
  mainBpm: number;
  backbeats: number;
  gallops: number;
  trips: number;
  offbeats: number;
  // FOR DEBUG
  // % of 32nd+ notes, which is considered as errors
  canonicalChartErrorRate: number;
};

type AllMeta = MixMeta & SongMeta & ChartMeta;


type Timestamp<T extends Fraction | number> = {
  time: T;
  offset: T;
};

// stops and bpm-changes with both timing and offset values
// BPMHINT is defined iff its BPM=0 (stop event), and is used to quantize stop duration.
type BpmEvent<T extends Fraction | number> =
  { bpm: T, stopBpm?: T, stopDuration?: string } & Timestamp<T>;

// arrows with both timing and offset values
type ArrowEvent<T extends Fraction | number> =
  Omit<Arrow, "offset"> & { tags: Partial<Record<ArrowTag, boolean>> } & Timestamp<T>;

type FreezeEvent<T extends Fraction | number> =
  Omit<FreezeBody, "startOffset" | "endOffset"> & { start: Timestamp<T>, end: Timestamp<T> };

type AnalyzedStepchart<T extends Fraction | number> = {
  freezeTimeline: FreezeEvent<T>[];
  arrowTimeline: ArrowEvent<T>[];
  bpmTimeline: BpmEvent<T>[];
  beatTimeline: Timestamp<T>[];
  // bpms of canonical charts may be different from the original ones
  minBpm: number;
  maxBpm: number;
  mainBpm: number;
};


type ChartData = {
  meta: AllMeta,
  chart: AnalyzedStepchart<number>,
  // EXPERIMENTAL
  canonicalChart: AnalyzedStepchart<number>,
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
