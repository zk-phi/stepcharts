import type Fraction from "fraction.js";

export const tagTrips = (
  arrowTimeline: ArrowEvent<Fraction>[],
  canonicalArrowTimeline: ArrowEvent<Fraction>[]
): void => {
  canonicalArrowTimeline.forEach((arrow, ix, arrows) => {
    if (ix > 0 && arrow.offset.sub(arrows[ix - 1].offset).equals(1/12)
        && ix + 1 <arrows.length && arrows[ix + 1].offset.sub(arrow.offset).equals(1/12)) {
      canonicalArrowTimeline[ix].tags.trip = true;
    }
  });
};
