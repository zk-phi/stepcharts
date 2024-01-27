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


// stops and bpm-changes with both timing and offset values
type BpmEvent = {
  time: number;
  offset: number;
  bpm: number;
};

// arrows with both timing and offset values
type ArrowEvent = Arrow & {
  time: number,
};

type FreezeEvent = Pick<FreezeBody, "direction"> & {
  start: { time: number, offset: number },
  end: { time: number, offset: number },
};

type AnalyzedStepchart = {
  freezeTimeline: FreezeEvent[];
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
