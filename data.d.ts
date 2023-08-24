type MixMeta = {
  mixId: string;
  name: string;
  shortName: string;
  year: number;
  bannerSrc: string | null;
};

type SongMeta = {
  songId: string;
  title: string;
  titleTranslit: string | null;
  artist: string;
  minBpm: number;
  maxBpm: number;
  displayBpm: string;
  bannerSrc: string | null;
};

type ChartMeta = {
  difficulty: Difficulty,
  level: number;
  arrows: number;
  stops: number;
  bpmShifts: number;
  freezes: number;
  jumps: number;
  jacks: number;
  gallops: number;
};
