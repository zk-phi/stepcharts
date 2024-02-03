// SHUFFLE5+MIRROR = SHUFFLE6
export const TURNS: Turn[] = [
  { name: "OFF", shortName: "OFF" },
  { name: "LEFT", shortName: "←" },
  { name: "RIGHT", shortName: "→" },
  { name: "MIRROR", shortName: "⇔" },
  { name: "SHUFFLE1 (→↑)", shortName: "?1" },
  { name: "SHUFFLE2 (↓←)", shortName: "?2" },
  { name: "SHUFFLE3 (↑←)", shortName: "?3" },
  { name: "SHUFFLE4 (→↑)", shortName: "?4" },
  { name: "SHUFFLE5 (↑↓)", shortName: "?5" },
  { name: "SHUFFLE6 (→←)", shortName: "?6" },
  { name: "SHUFFLE1+LEFT", shortName: "?1 + ←" },
  { name: "SHUFFLE2+LEFT", shortName: "?2 + ←" },
  { name: "SHUFFLE3+LEFT", shortName: "?3 + ←" },
  { name: "SHUFFLE4+LEFT", shortName: "?4 + ←" },
  { name: "SHUFFLE5+LEFT", shortName: "?5 + ←" },
  { name: "SHUFFLE1+RIGHT", shortName: "?1 + →" },
  { name: "SHUFFLE2+RIGHT", shortName: "?2 + →" },
  { name: "SHUFFLE3+RIGHT", shortName: "?3 + →" },
  { name: "SHUFFLE4+RIGHT", shortName: "?4 + →" },
  { name: "SHUFFLE5+RIGHT", shortName: "?5 + →" },
  { name: "SHUFFLE1+MIRROR", shortName: "?1 + ⇔" },
  { name: "SHUFFLE2+MIRROR", shortName: "?2 + ⇔" },
  { name: "SHUFFLE3+MIRROR", shortName: "?3 + ⇔" },
  { name: "SHUFFLE4+MIRROR", shortName: "?4 + ⇔" },
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
