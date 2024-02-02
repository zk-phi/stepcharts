import Fraction from "fraction.js";

export const BPM_PRECISION = 4; // 0.25
export const OFFSET_PRECISION = 192; // max precision of dwi DWI notes

export const bpmFrac = (value: number | string) => (
  new Fraction(Math.round(Number(value) * BPM_PRECISION), BPM_PRECISION)
);

export const offsetFrac = (value: number | string) => (
  new Fraction(Math.round(Number(value) * OFFSET_PRECISION), OFFSET_PRECISION)
);
