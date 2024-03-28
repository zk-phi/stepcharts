import Fraction from "fraction.js";
import { doffsetToTime, doffsetNumToTime, dtimeNumToOffset } from "./util";

export type Converter<T> = (input: T) => T;

export const makeOffsetToSecConverter =
  (bpmTimeline: BpmEvent<Fraction>[]): Converter<Fraction> => {
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

export const makeOffsetNumToSecConverter =
  (bpmTimeline: BpmEvent<number>[]): Converter<number> => {
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

export const makeSecNumToOffsetConverter =
  (bpmTimeline: BpmEvent<number>[]): Converter<number> => {
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
