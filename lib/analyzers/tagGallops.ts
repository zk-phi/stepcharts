import type Fraction from "fraction.js";

export const tagGallops = (
  arrowTimeline: ArrowEvent<Fraction>[],
  canonicalArrowTimeline: ArrowEvent<Fraction>[]
): void => {
  canonicalArrowTimeline.forEach((arrow, ix, arrows) => {
    const backward = ix > 0 && arrow.offset.sub(arrows[ix - 1].offset);
    const forward = ix + 1 <arrows.length && arrows[ix + 1].offset.sub(arrow.offset);
    if (backward && forward && (
      (backward.compare(1/16) > 0 && backward.compare(1/8) < 0 && forward.compare(1/16) < 0)
      || (backward.compare(1/8) > 0 && backward.compare(1/4) < 0 && forward.compare(1/8) < 0)
      || (forward.compare(1/16) > 0 && forward.compare(1/8) < 0 && backward.compare(1/16) < 0)
      || (forward.compare(1/8) > 0 && forward.compare(1/4) < 0 && backward.compare(1/8) < 0)
    )) {
      canonicalArrowTimeline[ix].tags.gallop = true;
    }
  });
};
