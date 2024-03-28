import Fraction from "fraction.js";
import { SPECIAL_BPMS } from "../../constants/specialBpms";
import { makeOffsetToSecConverter } from "../offsetConverters";
import { fixStopDuration, verifyQuantization } from "../stopQuantizer";
import { doffsetToTime, doffsetNumToTime, dtimeNumToOffset } from "../util";

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

    const specialBpms = SPECIAL_BPMS[songId];

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
        const stops = (
          specialBpms?.[difficulty]?.[timeline.length]
          ?? specialBpms?.all?.[timeline.length]
          ?? [fixStopDuration(timeline.length, stopEvent.stop, lastBpm, shiftEvent.bpm)]
        );
        verifyQuantization(stopEvent.stop, stops, true);
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
        const stops = (
          specialBpms?.[difficulty]?.[timeline.length]
          ?? specialBpms?.all?.[timeline.length]
          ?? [fixStopDuration(timeline.length, e.stop, lastBpm)]
        );
        verifyQuantization(e.stop, stops, true);
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
