import { OFFSET_PRECISION } from "../../constants/precision";

// EXPERIMENTAL
// FIXME

// over the period の開幕みたいな超絶キモい停止には対応できないのでどうするか。
// ... 22.5 でせり上がり、矢印の直前で停止、一瞬 22.5 で続きスクロールして矢印に到達、
// そこからは bpm 200。んで、停止の時間は「一瞬の 22.5 スクロール」と合わせると、
// 実質 200 の１小節相当になる。
// - over the period
// - the reason
// - hou
// - etc

// schwarzchild field あたりを見るに、そもそも停止の duration の精度が良くないやつも
// ありそう、元の sm/dwi の問題

// 後続の矢印見てから calib するんじゃなく、最初から停止の duration 自体を calib しちゃう
// んでもいいんじゃないかな。なんなら parseSimfile の時点で、とか。
// parseSimfile の時点で全てが整然とした状態になっていれば、 canonicalize はスムーズ
// になると思われる（そうであってくれ）。
// 懸念は「全ての停止が 24/16 分に収まる」という仮定が果たして成り立つか。あと矢印
// を見ないとオバピリみたいな変態ソフランはどうにもならんのではという懸念。
// 少なくとも calib の幅がデカくなりすぎた時は多分なにかがおかしいので、
// エラーなり warning なり出して検出できるようにはしておきたい

import Fraction from "fraction.js";
import { dtimeToOffset, doffsetToTime, computeBeatTimings } from "./timingAnalyzers";
import { calculateBpmStats } from "./calculateBpmStats";
import { determineBeat } from "../util";

// const SPECIAL_STOP_BPMS: Record<string, Record<number, Fraction>> = {
//   'over-the-period': {
//     6: new Fraction(200),
//   },
// };

// Convert bpm to a canonical value, which is in range 120 - 240.
export const canonicalBpm = (bpm: Fraction, _multiplier?: Fraction): [Fraction, Fraction] => (
  bpm.compare(120) < 0 ? (
    canonicalBpm(bpm.mul(2), _multiplier?.mul(2) ?? new Fraction(2))
  ) : bpm.compare(240) >= 0 ? (
    canonicalBpm(bpm.div(2), _multiplier?.div(2) ?? new Fraction(1, 2))
  ) : (
    [bpm, _multiplier ?? new Fraction(1)]
  )
);

const _quantizeOS = (value: Fraction, aggressive?: boolean) => {
  return value.mul(OFFSET_PRECISION).round().div(OFFSET_PRECISION);
};

type Converter = (input: Fraction) => Fraction;
const _makeSecToOffsetConverter = (bpmTimeline: BpmEvent<Fraction>[]): Converter => {
  let ix = 0;
  const secToOffset = (sec: Fraction): Fraction => {
    if (sec.compare(0) <= 0) {
      ix = 0;
    }
    while (ix > 0 && sec.compare(bpmTimeline[ix].time) <= 0) {
      ix--;
    }
    while (bpmTimeline[ix + 1] && sec.compare(bpmTimeline[ix + 1].time) > 0) {
      ix++;
    }
    const dOffset = dtimeToOffset(sec.sub(bpmTimeline[ix].time), bpmTimeline[ix].bpm);
    return _quantizeOS(bpmTimeline[ix].offset.add(dOffset));
  };
  return secToOffset;
}

// Canonicalize a stepchart, by canonicalizing its bpms, and by removing its all stops.
// This removes all VISUAL gimmicks from the chart (like bpm-shift from 200 to 400).
// Note that real bpm-shifts (like 130 -> 150) are NOT removed here.
export const computeCanonicalChart =
  (songId: string, chart: AnalyzedStepchart<Fraction>): AnalyzedStepchart<Fraction> => {
    const { arrowTimeline: arrows, freezeTimeline: freezes, bpmTimeline: bpms } = chart;

    const canonicalArrowTimeline: ArrowEvent<Fraction>[] = [];
    const canonicalBpmTimeline: BpmEvent<Fraction>[] = [{
      time: new Fraction(0),
      offset: new Fraction(0),
      bpm: canonicalBpm(bpms[0].bpm)[0],
    }];

    // canonicalize chart.bpmTimeline[bi] and push to canonicalBpmTimeline.
    // returns number of consumed bpm events
    const _canonicalizeBpmEvent = (bi: number): number => {
      const last = canonicalBpmTimeline[canonicalBpmTimeline.length - 1];
      const curr = bpms[bi];
      const doffset = _quantizeOS(dtimeToOffset(curr.time.sub(last.time), last.bpm));
      const offset = last.offset.add(doffset);

      if (!curr.bpm.equals(0)) {
        // bpm-shift event without stop
        canonicalBpmTimeline.push({ bpm: canonicalBpm(curr.bpm)[0], time: curr.time, offset });
        return 1;
      } else {
        // stop event
        const next = bpms[bi + 1]!; // another bpm event MUST EXIST after a stop event
        const [bpmHint] = canonicalBpm(curr.bpmHint!);
        const [nextBpm] = canonicalBpm(next.bpm);
        if (last.bpm.equals(bpmHint)) {
          if (bpmHint.equals(nextBpm)) {
            // simple stop-and-go without bpm-shift (-> just ignore)
          } else {
            // stop-then-bpmshift
            const doffset = _quantizeOS(dtimeToOffset(next.time.sub(curr.time), last.bpm));
            const nextOffset = offset.add(doffset);
            canonicalBpmTimeline.push({ bpm: nextBpm, time: next.time, offset: nextOffset });
          }
        } else {
          if (bpmHint.equals(nextBpm)) {
            // bpmshift-then-stop
            canonicalBpmTimeline.push({ bpm: nextBpm, time: curr.time, offset });
          } else {
            // shift-stop-then-shift-again (-> shift twice)
            const doffset = _quantizeOS(dtimeToOffset(next.time.sub(curr.time), bpmHint));
            const nextOffset = offset.add(doffset);
            canonicalBpmTimeline.push({ bpm: bpmHint, time: curr.time, offset });
            canonicalBpmTimeline.push({ bpm: nextBpm, time: next.time, offset: nextOffset });
          }
        }
        return 2; // we have canonicalized two events (shift and stop) here
      }
    };

    // canonicalize arrow events and bpm events
    let bi = 0;
    for (let ai = 0; ai < chart.arrowTimeline.length; ai++) {
      // if arrow.offset > nextBpmEvent.offset, fetch (and canonicalize) next bpm event
      while (bpms[bi + 1] && arrows[ai].offset.compare(bpms[bi + 1].offset) > 0)  {
        bi += _canonicalizeBpmEvent(bi + 1);
      }
      const currentBpm = canonicalBpmTimeline[canonicalBpmTimeline.length - 1];
      const arr = arrows[ai];
      const dOffset = _quantizeOS(dtimeToOffset(arr.time.sub(currentBpm.time), currentBpm.bpm));
      const offset = currentBpm.offset.add(dOffset);
      canonicalArrowTimeline.push({
        direction: arr.direction,
        tags: arr.tags,
        beat: determineBeat(offset),
        time: arr.time,
        offset,
      });
    }

    const converter1 = _makeSecToOffsetConverter(canonicalBpmTimeline);
    const converter2 = _makeSecToOffsetConverter(canonicalBpmTimeline);
    const canonicalFreezeTimeline = freezes.map((f) => ({
      ...f,
      start: {
        time: f.start.time,
        offset: converter1(f.start.time),
      },
      end: {
        time: f.end.time,
        offset: converter2(f.end.time),
      },
    }));

    const lastArrowOffset = canonicalArrowTimeline[canonicalArrowTimeline.length - 1].offset;
    const lastMeasure = Math.floor(lastArrowOffset.n / lastArrowOffset.d);
    const canonicalBeatTimeline = computeBeatTimings(lastMeasure, canonicalBpmTimeline);

    return {
      bpmTimeline: canonicalBpmTimeline,
      arrowTimeline: canonicalArrowTimeline,
      freezeTimeline: canonicalFreezeTimeline,
      beatTimeline: canonicalBeatTimeline,
      ...calculateBpmStats(canonicalArrowTimeline, canonicalBpmTimeline),
    };
  };
