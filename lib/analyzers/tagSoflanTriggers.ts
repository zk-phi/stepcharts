import Fraction from "fraction.js";

export const tagSoflanTriggers =
  (arrowTimeline: ArrowEvent<Fraction>[], bpmTimeline: BpmEvent<Fraction>[]): void => {
    if (bpmTimeline.length <= 1) return;
    let bi = 1;
    arrowTimeline.forEach((a, ai) => {
      while (bi < bpmTimeline.length
          && a.offset.compare(bpmTimeline[bi].offset) > 0) {
        bi++;
      }
      if (bi < bpmTimeline.length
          && ai + 1 < arrowTimeline.length
          && bpmTimeline[bi].offset.compare(arrowTimeline[ai + 1].offset) < 0
          && bpmTimeline[bi].offset.sub(a.offset).compare(0.34) <= 0) {
        a.tags.soflanTrigger = true;
      }
    });
  }
