type StepchartType = {
  difficulty: Difficulty;
  feet: number;
};

type Simfile = {
  title: Title;
  artist: string;
  availableTypes: StepchartType[];
  topDifficulty: Difficulty;
  stats: Record<Difficulty, Stats>;
  charts: Record<string, Stepchart>;
  minBpm: number;
  maxBpm: number;
  displayBpm: string;
  stopCount: number;
};
