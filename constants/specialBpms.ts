import Fraction from "fraction.js";

type Stop = [Fraction, { stopBpm: Fraction, stopDuration: string }]
const doffsetToTime = (offset: Fraction, bpm: Fraction) => offset.mul(4).div(bpm).mul(60);

const overThePeriod = ((): Stop => {
  const bpm = new Fraction(200);
  const offset = new Fraction(1);
  const duration = doffsetToTime(offset, bpm);
  return [duration, { stopBpm: bpm, stopDuration: offset.toFraction(true) }];
})();

const faxx = ((): Stop => {
  const bpm = new Fraction(200);
  const offset = new Fraction(11, 32);
  const duration = doffsetToTime(offset, bpm);
  return [duration, { stopBpm: bpm, stopDuration: offset.toFraction(true) }];
})();

const chaos = ((): Stop => {
  const bpm = new Fraction(170);
  const offset = new Fraction(7, 32).sub(1, 64);
  const duration = doffsetToTime(offset, bpm);
  return [duration, { stopBpm: bpm, stopDuration: offset.toFraction(true) }];
})();

export const SPECIAL_BPMS: Record<string, Partial<Record<Difficulty, Record<number, Stop>>>> = {
  "over-the-period": {
    beginner:  { 5: overThePeriod },
    basic:     { 5: overThePeriod },
    difficult: { 5: overThePeriod },
    expert:    { 5: overThePeriod },
    challenge: { 5: overThePeriod },
  },
  "fascination-maxx": {
    beginner:  { 13: faxx },
    basic:     { 13: faxx },
    difficult: { 13: faxx },
    expert:    { 13: faxx },
    challenge: { 13: faxx },
  },
  "chaos": {
    beginner:  { 55: chaos },
    basic:     { 55: chaos },
    difficult: { 55: chaos },
    expert:    { 55: chaos },
    challenge: { 55: chaos },
  },
};
