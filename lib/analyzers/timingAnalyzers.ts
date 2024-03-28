import Fraction from "fraction.js";
import { canonicalBpm } from "./computeCanonicalChart";
import { SPECIAL_BPMS } from "../../constants/specialBpms";

export const doffsetToTime = (offset: Fraction, bpm: Fraction) => offset.mul(4).div(bpm).mul(60);
export const dtimeToOffset = (sec: Fraction, bpm: Fraction) => bpm.mul(sec).div(60).div(4);
export const doffsetNumToTime = (offset: number, bpm: number) => offset * 4 * 60 / bpm;
export const dtimeNumToOffset = (sec: number, bpm: number) => sec * bpm / 60 / 4;

const QUANTIZATION_THRESHOLD = new Fraction(1, 60); // 1f in 60fps

const _quantizeDuration = (
  duration: Fraction,
  bpm: Fraction,
  to: string,
): [Fraction, { stopBpm: Fraction, stopDuration: string }] => {
  const [cBpm, bpmMult] = canonicalBpm(bpm);
  const offset = dtimeToOffset(duration, cBpm);
  const quantizedOffset = offset.roundTo(to);
  const quantizedDuration = doffsetToTime(quantizedOffset, cBpm);
  return [quantizedDuration, {
    stopBpm: bpm,
    stopDuration: quantizedOffset.div(bpmMult).toFraction(true),
  }];
}

const _fixStopDuration = (
  ix: number,
  duration: Fraction,
  bpm1: Fraction,
  bpm2?: Fraction,
  _conservative?: boolean,
): [Fraction, { stopBpm: Fraction, stopDuration: string }] => {
  const candidates = [];
  candidates.push(_quantizeDuration(duration, bpm1, _conservative ? "1/32" : "1/16"));
  candidates.push(_quantizeDuration(duration, bpm1, _conservative ? "1/24" : "1/12"));
  if (bpm2) {
    candidates.push(_quantizeDuration(duration, bpm2, _conservative ? "1/32" : "1/16"));
    candidates.push(_quantizeDuration(duration, bpm2, _conservative ? "1/24" : "1/12"));
  }
  const accepted = candidates.filter((c) => (
    c[0].sub(duration).abs().compare(QUANTIZATION_THRESHOLD) <= 0
  )).filter((c, i, cs) => (
    i === 0 || !c[0].equals(cs[i - 1][0])
  ));
  if (accepted.length === 1) {
    return accepted[0];
  } else if (accepted.length === 0 && !_conservative) {
    return _fixStopDuration(ix, duration, bpm1, bpm2, true);
  } else {
    throw new Error(
      `Cannot quantize stop:\n- index: ${ix}\n- duration: ${duration}\nCandidates:\n`
      + candidates.map((c) => (
        `${c[1].stopDuration} @${c[1].stopBpm} (err: ${c[0].sub(duration).mul(60)}f @60fps)`
      )).join("\n")
    );
  }
};

// Align all stops and bpm-changes into a single timeline.
// All timeline events will have both offset and timing value.
// Stops are represented by bpm-changes to zero.
export const extractBpmEvents =
  (songId: string, difficulty: Difficulty, chart: Stepchart): BpmEvent<Fraction>[] => {
    const bpmEvents = [
      ...chart.bpm.map((b) => (
        { offset: b.startOffset, bpm: b.bpm }
      )),
      ...chart.stops.map((s) => (
        { offset: s.offset, stop: s.duration }
      )),
    ].sort((a, b) => (
      a.offset - b.offset
    ));

    const specialBpms = SPECIAL_BPMS[songId]?.[difficulty];

    while (!('bpm' in bpmEvents[0])) {
      bpmEvents.shift();
    }

    const timeline: BpmEvent<Fraction>[] = [{
      time: new Fraction(0),
      offset: new Fraction(0),
      // @ts-ignore `bpm` can be undefined in type-level, but it's always defined in the real data
      bpm: bpmEvents.shift().bpm,
    }];

    for (let i = 0; i < bpmEvents.length; i++) {
      const e = bpmEvents[i]!;
      const next = bpmEvents[i + 1];
      const lastBpm = timeline[0].bpm;
      const dt = doffsetToTime(e.offset.sub(timeline[0].offset), lastBpm);
      let time = dt.add(timeline[0].time);
      const baseEntry = { offset: e.offset };
      if (next && e.offset === next.offset) {
        // stop and bpm-shift at the same time
        const stopEvent  = 'stop' in e ? e : 'stop' in next ? next : null;
        const shiftEvent = 'bpm'  in e ? e : 'bpm'  in next ? next : null;
        if (!stopEvent || !shiftEvent) {
          throw new Error("Unexpected: duplicated BPM events");
        }
        const stops = specialBpms?.[timeline.length] ?? [
          _fixStopDuration(timeline.length, stopEvent.stop, lastBpm, shiftEvent.bpm)
        ];
        stops.forEach((s) => {
          timeline.unshift({ ...baseEntry, time, bpm: new Fraction(0), ...s[1] });
          time = time.add(s[0]);
        });
        timeline.unshift({ ...baseEntry, time, bpm: shiftEvent.bpm });
        i++;
      } else if ('bpm' in e) {
        // simple bpm-shift
        timeline.unshift({ ...baseEntry, time, bpm: e.bpm });
      } else if ('stop' in e){
        // simple stop-and-go
        const stops = specialBpms?.[timeline.length] ?? [
          _fixStopDuration(timeline.length, e.stop, lastBpm)
        ];
        stops.forEach((s) => {
          timeline.unshift({ ...baseEntry, time, bpm: new Fraction(0), ...s[1] });
          time = time.add(s[0]);
        });
        timeline.unshift({ ...baseEntry, time, bpm: lastBpm });
      } else {
        throw new Error("Unexpected: BPM event is not stop nor bpm-shift");
      }
    }

    return timeline.reverse();
  };

// Generate a function that converts offset value (based on measures)
// to time value in seconds.
type Converter<T> = (input: T) => T;
export const makeOffsetToSecConverter = (bpmTimeline: BpmEvent<Fraction>[]): Converter<Fraction> => {
  let ix = 0;
  const offsetToSec = (offset: Fraction): Fraction => {
    if (offset.compare(0) <= 0) {
      ix = 0;
    }
    while (ix > 0 && offset.compare(bpmTimeline[ix].offset) <= 0) {
      ix--;
    }
    while (bpmTimeline[ix + 1] && offset.compare(bpmTimeline[ix + 1].offset) > 0) {
      ix++;
    }
    const dt = doffsetToTime(offset.sub(bpmTimeline[ix].offset), bpmTimeline[ix].bpm);
    return bpmTimeline[ix].time.add(dt);
  };
  return offsetToSec;
}

export const makeOffsetNumToSecConverter = (bpmTimeline: BpmEvent<number>[]): Converter<number> => {
  let ix = 0;
  const offsetToSec = (offset: number): number => {
    if (offset <= 0) {
      ix = 0;
    }
    while (ix > 0 && offset <= bpmTimeline[ix].offset) {
      ix--;
    }
    while (bpmTimeline[ix + 1] && offset > bpmTimeline[ix + 1].offset) {
      ix++;
    }
    const dt = doffsetNumToTime(offset - bpmTimeline[ix].offset, bpmTimeline[ix].bpm);
    return bpmTimeline[ix].time + dt;
  };
  return offsetToSec;
}

export const makeSecNumToOffsetConverter = (bpmTimeline: BpmEvent<number>[]): Converter<number> => {
  let ix = 0;
  const secToOffset = (sec: number): number => {
    if (sec <= 0) {
      ix = 0;
    }
    while (ix > 0 && sec <= bpmTimeline[ix].time) {
      ix--;
    }
    while (bpmTimeline[ix + 1] && sec > bpmTimeline[ix + 1].time) {
      ix++;
    }
    const doffset = dtimeNumToOffset(sec - bpmTimeline[ix].time, bpmTimeline[ix].bpm);
    return bpmTimeline[ix].offset + doffset;
  };
  return secToOffset;
}

export const computeArrowTimings =
  (arrows: Arrow[], bpms: BpmEvent<Fraction>[]): ArrowEvent<Fraction>[] => {
    const converter = makeOffsetToSecConverter(bpms);
    return arrows.map((arrow) => ({ ...arrow, tags: {}, time: converter(arrow.offset) }));
  };

export const computeFreezeTimings =
  (freezes: FreezeBody[], bpms: BpmEvent<Fraction>[]): FreezeEvent<Fraction>[] => {
    const converter1 = makeOffsetToSecConverter(bpms);
    const converter2 = makeOffsetToSecConverter(bpms);
    return freezes.map((freeze) => ({
      direction: freeze.direction,
      start: {
        offset: freeze.startOffset,
        time: converter1(freeze.startOffset),
      },
      end: {
        offset: freeze.endOffset,
        time: converter2(freeze.endOffset),
      }
    }));
  };

export const computeBeatTimings =
  (lastMeasure: number, bpms: BpmEvent<Fraction>[]): Timestamp<Fraction>[] => {
    const converter = makeOffsetToSecConverter(bpms);
    let offset = new Fraction(-1, 4);
    return [...Array((lastMeasure + 1) * 4)].map(() => {
      offset = offset.add(1, 4);
      return { offset, time: converter(offset) };
    });
  };
