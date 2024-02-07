import Fraction from "fraction.js";

const beats = [
  new Fraction(1).div(4),
  new Fraction(1).div(6),
  new Fraction(1).div(8),
  new Fraction(1).div(12),
  new Fraction(1).div(16),
  new Fraction(1).div(24),
  new Fraction(1).div(32),
  new Fraction(1).div(64),
];

function determineBeat(offset: Fraction): Arrow["beat"] {
  const match = beats.find((b) => offset.mod(b).n === 0);

  if (!match) {
    return "other";
  }

  return match.d as Arrow["beat"];
}

const normalizedDifficultyMap: Record<string, Difficulty> = {
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

const mergeSameBpms = (bpms: Bpm[]): Bpm[] => (
  bpms.filter((b, i) => i === 0 || !bpms[i - 1].bpm.equals(b.bpm))
);

export {
  determineBeat,
  normalizedDifficultyMap,
  mergeSameBpms,
};
