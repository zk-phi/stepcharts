type Direction = 0 | 1 | 2 | 3;
type Beat = 4 | 6 | 8 | 12 | 16;

type TurnValue = "OFF" | "LEFT" | "RIGHT" | "MIRROR" |
  "SHUFFLE1 (→↑)" | "SHUFFLE1+LEFT" | "SHUFFLE1+RIGHT" | "SHUFFLE1+MIRROR" |
  "SHUFFLE2 (↓←)" | "SHUFFLE2+LEFT" | "SHUFFLE2+RIGHT" | "SHUFFLE2+MIRROR" |
  "SHUFFLE3 (↑←)" | "SHUFFLE3+LEFT" | "SHUFFLE3+RIGHT" | "SHUFFLE3+MIRROR" |
  "SHUFFLE4 (→↑)" | "SHUFFLE4+LEFT" | "SHUFFLE4+RIGHT" | "SHUFFLE4+MIRROR" |
  "SHUFFLE5 (↑↓)" | "SHUFFLE5+LEFT" | "SHUFFLE5+RIGHT" |
  "SHUFFLE6 (→←)";
type Turn = { name: TurnValue, shortName: string };
