import Fraction from "fraction.js";

export const BPM_PRECISION = 2; // 0.5
export const OFFSET_PRECISION = 192; // max precision of dwi DWI notes

export const bpmFrac = (value: number) => (
  new Fraction(Math.round(value * BPM_PRECISION), BPM_PRECISION)
);

export const offsetFrac = (value: number) => (
  new Fraction(Math.round(value * OFFSET_PRECISION), OFFSET_PRECISION)
);
