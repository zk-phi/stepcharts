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
  // ---- 意図的な 32/64 分ズレを含む譜面（途中から全矢印が緑になる系）
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
  "saber-wing-akira-ishihara-headshot-mix": {
    all: {
      0: [s(316, 1, 4)],
    },
  },
  // ---- 直前後と違う BPM で停止する譜面
  "over-the-period": {
    all: {
      5: [s(200, 4, 4)],
    },
  },
  // ---- 謎の長さの停止が入る譜面
  "awa-odori-awaodori-yappari-odori-wa-yame-rarenai": {
    all: {
      2:  [s(178, 5, 4), s(190, 3, 4)],
      6:  [s(190, 5, 4), s(130, 3, 4)],
      13: [s(222, 5, 4), s(170, 1, 4)],
    },
  },
  "stella-sinistra": {
    all: {
      8: [s(110, 3, 4)],
    },
  },
  "insertion": {
    all: {
      2: [s(131, 3, 4)],
    }
  },
  "a": {
    all: {
      2: [s(93, 1, 4), s(191, 2, 4)],
    },
  },
  "max-300": {
    // 実際には謎の長さではないのだが、じわじわ遅くなるギミックのせいで謎になってる
    // これなんとかできたらなあ
    all: {
      22: [s(190, 11, 16)],
    },
  },
  "go-for-the-top": {
    all: {
      25: [s(172, 2, 4)],
    },
  },
  // ---- 停止が短すぎて 24 分か 32 分か自動判定できないやつ
  "let-me-know": {
    all: {
      1: [s(150, 1, 32)],
      3: [s(150, 1, 32)],
      5: [s(150, 1, 32)],
      7: [s(150, 1, 32)],
    },
  },
  "breaking-the-future": {
    // ６分になってしまう
    all: {
      26: [s(360, 3, 16)],
      28: [s(360, 3, 16)],
      34: [s(360, 3, 16)],
      36: [s(360, 3, 16)],
      42: [s(360, 3, 16)],
      44: [s(360, 3, 16)],
      50: [s(360, 3, 16)],
      52: [s(360, 3, 16)],
      58: [s(360, 3, 16)],
      60: [s(360, 3, 16)],
    },
  },
  // ---- シンプルに元データが間違ってるっぽい譜面
  "the-reason": {
    all: {
      2: [s(98, 1, 16)],
    },
  },
  "the-legend-of-max": {
    all: {
      5: [s(83.5, 1, 4)],
    },
  },
  // よくわからんので現物合わせ
  "tokyoevolved-type1": {
    all: {
      7:  [s(281.5, 1, 4)],
      17: [s(281.5, 1, 4)],
      26: [s(281.5, 1, 4)],
      36: [s(300,   1, 4)],
    },
  },
  "tokyoevolved-type2": {
    all: {
      7:  [s(281.5, 1, 4)],
      17: [s(281.5, 1, 4)],
      26: [s(281.5, 1, 4)],
      36: [s(300,   1, 4)],
      45: [s(300,   1, 4)],
    },
  },
  "tokyoevolved-type3": {
    all: {
      7:  [s(281.5, 1, 4)],
      17: [s(290,   1, 4)],
      26: [s(281.5, 1, 4)],
      36: [s(300,   1, 4)],
      49: [s(311,   1, 4)],
      53: [s(300,   1, 4)],
    },
  },
  // ---- TODO
  "xmix1-midnight-dawn": {
    all: {
      10: [s(144, 1, 4)],
    },
  },
};
