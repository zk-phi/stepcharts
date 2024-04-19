import type Fraction from "fraction.js";

export const tagBackbeats = (
  arrowTimeline: ArrowEvent<Fraction>[],
  canonicalArrowTimeline: ArrowEvent<Fraction>[]
): void => {
  canonicalArrowTimeline.forEach((arrow, ix, arrows) => {
    if (arrow.beat === 8
        && ix > 0 && arrow.offset.sub(arrows[ix - 1].offset).equals(0.25)
        && ix + 1 < arrows.length && arrows[ix + 1].offset.sub(arrow.offset).equals(0.25)) {
      canonicalArrowTimeline[ix].tags.backbeat = true;
    }
  });
};
