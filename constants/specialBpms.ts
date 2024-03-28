import Fraction from "fraction.js";

type Stop = [Fraction, { stopBpm: Fraction, stopDuration: string }]
const doffsetToTime = (offset: Fraction, bpm: Fraction) => offset.mul(4).div(bpm).mul(60);

const s = (bpm: number, n: number, d: number): Stop => {
  const bpmFrac = new Fraction(bpm);
  const offset = new Fraction(n, d);
  const duration = doffsetToTime(offset, bpmFrac);
  return [duration, { stopBpm: bpmFrac, stopDuration: offset.toFraction(true) }];
};

const overThePeriod = {
  5: [s(220, 4, 4)],
};

const faxx = {
  13: [s(200, 11, 32)],
};

const chaos = {
  51: [s(170,  7, 32)],
  55: [s(170, 13, 64)],
  57: [s(170,  7, 32)],
  59: [s(170,  7, 32)],
  65: [s(170,  7, 32)],
  67: [s(170,  7, 32)],
  69: [s(170,  7, 32)],
  73: [s(170,  7, 32)],
  75: [s(170,  7, 32)],
};

const theReason = {
  2: [s(98, 1, 16)],
};

const awaodori = {
  2:  [s(185, 5, 4), s(190, 3, 4)],
  6:  [s(190, 5, 4), s(130, 3, 4)],
  13: [s(222, 5, 4), s(170, 1, 4)],
};

// FIXME
const tokyo1 = {
  7:  [s(257, 1, 4)],
  17: [s(257, 1, 4)],
  26: [s(250, 1, 4)],
  36: [s(257, 1, 4)],
};

// FIXME
const tokyo2 = {
  7:  [s(257, 1, 4)],
  17: [s(257, 1, 4)],
  26: [s(250, 1, 4)],
  36: [s(257, 1, 4)],
  45: [s(264.5, 1, 4)],
};

// FIXME
const tokyo3 = {
  7:  [s(257, 1, 4)],
  17: [s(257, 1, 4)],
  26: [s(250, 1, 4)],
  36: [s(257, 1, 4)],
  49: [s(257, 3, 16)],
  53: [s(257, 3, 16)],
};

export const SPECIAL_BPMS: Record<string, Partial<Record<Difficulty, Record<number, Stop[]>>>> = {
  "over-the-period": {
    beginner:  overThePeriod,
    basic:     overThePeriod,
    difficult: overThePeriod,
    expert:    overThePeriod,
    challenge: overThePeriod,
  },
  "fascination-maxx": {
    beginner:  faxx,
    basic:     faxx,
    difficult: faxx,
    expert:    faxx,
    challenge: faxx,
  },
  "chaos": {
    beginner:  chaos,
    basic:     chaos,
    difficult: chaos,
    expert:    chaos,
    challenge: chaos,
  },
  "the-reason": {
    beginner:  theReason,
    basic:     theReason,
    difficult: theReason,
    expert:    theReason,
    challenge: theReason,
  },
  "awa-odori-awaodori-yappari-odori-wa-yame-rarenai": {
    beginner:  awaodori,
    basic:     awaodori,
    difficult: awaodori,
    expert:    awaodori,
    challenge: awaodori,
  },
  "tokyoevolved-type1": {
    beginner:  tokyo1,
    basic:     tokyo1,
    difficult: tokyo1,
    expert:    tokyo1,
    challenge: tokyo1,
  },
  "tokyoevolved-type2": {
    beginner:  tokyo2,
    basic:     tokyo2,
    difficult: tokyo2,
    expert:    tokyo2,
    challenge: tokyo2,
  },
  "tokyoevolved-type3": {
    beginner:  tokyo3,
    basic:     tokyo3,
    difficult: tokyo3,
    expert:    tokyo3,
    challenge: tokyo3,
  },
};
