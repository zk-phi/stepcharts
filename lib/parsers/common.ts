export type RawSimfile = Omit<Simfile, "title"> & {
  title: string;
  titletranslit: string | null;
};

export type Parser = (simfileSource: string, titleDir: string) => RawSimfile;

export const normalizedDifficultyMap: Record<string, Difficulty> = {
  beginner: "beginner",
  easy: "basic",
  basic: "basic",
  trick: "difficult",
  another: "difficult",
  medium: "difficult",
  difficult: "expert",
  expert: "expert",
  maniac: "expert",
  ssr: "expert",
  hard: "expert",
  challenge: "challenge",
  smaniac: "challenge",
  // TODO: filter edits out altogether
  edit: "edit",
};
