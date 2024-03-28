import Fraction from "fraction.js";

type Stop = [Fraction, { stopBpm: Fraction, stopDuration: string }]
const doffsetToTime = (offset: Fraction, bpm: Fraction) => offset.mul(4).div(bpm).mul(60);

const s = (bpm: number, n: number, d: number): Stop => {
  const bpmFrac = new Fraction(bpm);
  const offset = new Fraction(n, d);
  const duration = doffsetToTime(offset, bpmFrac);
  return [duration, { stopBpm: bpmFrac, stopDuration: offset.toFraction(true) }];
};

export
const SPECIAL_BPMS: Record<string, Partial<Record<Difficulty | "all", Record<number, Stop[]>>>> = {
  "over-the-period": {
    all: {
      5: [s(200, 4, 4)],
    },
  },
  "fascination-maxx": {
    all: {
      13: [s(200, 11, 32)],
    },
  },
  "chaos": {
    all: {
      0:  [s(170,  3, 16)], // 色分けの補正用
      53: [s(170,  7, 32)],
      57: [s(170, 13, 64)],
      59: [s(170,  7, 32)],
      61: [s(170,  7, 32)],
      67: [s(170,  7, 32)],
      69: [s(170,  7, 32)],
      71: [s(170,  7, 32)],
      75: [s(170,  7, 32)],
      77: [s(170,  7, 32)],
    },
  },
  "the-reason": {
    all: {
      2: [s(98, 1, 16)],
    },
  },
  "awa-odori-awaodori-yappari-odori-wa-yame-rarenai": {
    all: {
      2:  [s(178, 5, 4), s(190, 3, 4)],
      6:  [s(190, 5, 4), s(130, 3, 4)],
      13: [s(222, 5, 4), s(170, 1, 4)],
    },
  },
  // FIXME
  "tokyoevolved-type1": {
    all: {
      7:  [s(257, 1, 4)],
      17: [s(257, 1, 4)],
      26: [s(250, 1, 4)],
      36: [s(257, 1, 4)],
    },
  },
  // FIXME
  "tokyoevolved-type2": {
    all: {
      7:  [s(257, 1, 4)],
      17: [s(257, 1, 4)],
      26: [s(250, 1, 4)],
      36: [s(257, 1, 4)],
      45: [s(264.5, 1, 4)],
    },
  },
  // FIXME
  "tokyoevolved-type3": {
    all: {
      7:  [s(257, 1, 4)],
      17: [s(257, 1, 4)],
      26: [s(250, 1, 4)],
      36: [s(257, 1, 4)],
      49: [s(257, 3, 16)],
      53: [s(257, 3, 16)],
    },
  },
};
