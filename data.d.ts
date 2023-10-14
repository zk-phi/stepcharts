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
};

type BpmEvent = {
  time: number;
  offset: number;
  bpm: number;
};

type ChartTimeline = {
  bpmTimeline: BpmEvent[];
};

type AllMeta = MixMeta & SongMeta & ChartMeta & { filterString: string };
type ChartData = Stepchart & ChartTimeline & { meta: AllMeta };

type Index = {
  id: string,
  songs: {
    id: string,
    charts: {
      difficulty: string;
    }[],
  }[]
}[];
