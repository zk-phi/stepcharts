import type Fraction from "fraction.js";

export const tagOffbeats = (
  arrowTimeline: ArrowEvent<Fraction>[],
  canonicalArrowTimeline: ArrowEvent<Fraction>[]
): void => {
  canonicalArrowTimeline.forEach((arrow, ix, arrows) => {
    const forward = ix > 0 && arrow.offset.sub(arrows[ix - 1].offset);
    const backward = ix + 1 < arrows.length && arrows[ix + 1].offset.sub(arrow.offset);
    if ((arrow.beat !== 4 && arrow.beat !== 8)
        && backward && backward.compare(1/8) >= 0
        && (!forward || forward.compare(1/8) >= 0)) {
      canonicalArrowTimeline[ix].tags.offbeat = true;
    }
  });
};
