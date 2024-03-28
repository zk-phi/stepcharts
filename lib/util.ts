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

export function determineBeat(offset: Fraction): Arrow["beat"] {
  const match = beats.find((b) => offset.mod(b).n === 0);

  if (!match) {
    return "other";
  }

  return match.d as Arrow["beat"];
}

export const mergeSameBpms = (bpms: Bpm[]): Bpm[] => (
  bpms.filter((b, i) => i === 0 || !bpms[i - 1].bpm.equals(b.bpm))
);
