// SHUFFLE5+MIRROR = SHUFFLE6
export const TURNS: Turn[] = [
  "OFF",
  "LEFT",
  "RIGHT",
  "MIRROR",
  "SHUFFLE1 (→↑)",
  "SHUFFLE2 (↓←)",
  "SHUFFLE3 (↑←)",
  "SHUFFLE4 (→↑)",
  "SHUFFLE5 (↑↓)",
  "SHUFFLE6 (→←)",
  "SHUFFLE1+LEFT",
  "SHUFFLE2+LEFT",
  "SHUFFLE3+LEFT",
  "SHUFFLE4+LEFT",
  "SHUFFLE5+LEFT",
  "SHUFFLE1+RIGHT",
  "SHUFFLE2+RIGHT",
  "SHUFFLE3+RIGHT",
  "SHUFFLE4+RIGHT",
  "SHUFFLE5+RIGHT",
  "SHUFFLE1+MIRROR",
  "SHUFFLE2+MIRROR",
  "SHUFFLE3+MIRROR",
  "SHUFFLE4+MIRROR",
];

export const TURN_VALUES: Record<Turn, [Direction, Direction, Direction, Direction]> = {
  "OFF":             [0, 1, 2, 3],
  "LEFT":            [2, 0, 3, 1],
  "RIGHT":           [1, 3, 0, 2],
  "MIRROR":          [3, 2, 1, 0],
  "SHUFFLE1 (→↑)":   [0, 1, 3, 2], // 2-3
  "SHUFFLE2 (↓←)":   [1, 0, 2, 3], // 0-1
  "SHUFFLE3 (↑←)":   [2, 1, 0, 3], // 0-2
  "SHUFFLE4 (→↑)":   [0, 3, 2, 1], // 1-3
  "SHUFFLE5 (↑↓)":   [0, 2, 1, 3], // 1-2
  "SHUFFLE6 (→←)":   [3, 1, 2, 0], // 0-3
  "SHUFFLE1+LEFT":   [3, 0, 2, 1],
  "SHUFFLE2+LEFT":   [2, 1, 3, 0],
  "SHUFFLE3+LEFT":   [0, 2, 3, 1],
  "SHUFFLE4+LEFT":   [2, 0, 1, 3],
  "SHUFFLE5+LEFT":   [1, 0, 3, 2],
  "SHUFFLE1+RIGHT":  [1, 2, 0, 3],
  "SHUFFLE2+RIGHT":  [0, 3, 1, 2],
  "SHUFFLE3+RIGHT":  [1, 3, 2, 0],
  "SHUFFLE4+RIGHT":  [3, 1, 0, 2],
  "SHUFFLE5+RIGHT":  [2, 3, 0, 1],
  "SHUFFLE1+MIRROR": [2, 3, 1, 0],
  "SHUFFLE2+MIRROR": [3, 2, 0, 1],
  "SHUFFLE3+MIRROR": [3, 0, 1, 2],
  "SHUFFLE4+MIRROR": [1, 2, 3, 0],
};
