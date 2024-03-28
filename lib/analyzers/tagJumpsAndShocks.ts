import type Fraction from "fraction.js";

export const tagJumpsAndShocks = (arrowTimeline: ArrowEvent<Fraction>[]): void => {
  arrowTimeline.forEach((arrow) => {
    if (arrow.direction.match(/M/)) {
      arrow.tags.shock = true;
    }
    if (arrow.direction.match(/[12].*[12]/)) {
      arrow.tags.jump = true;
    }
  });
};
