type Direction = 0 | 1 | 2 | 3;
type Beat = 4 | 6 | 8 | 12 | 16;

type Turn = "OFF" | "LEFT" | "RIGHT" | "MIRROR" |
  "SHUFFLE1 (→↑)" | "SHUFFLE1+LFT" | "SHUFFLE1+RGT" | "SHUFFLE1+MIR" |
  "SHUFFLE2 (↓←)" | "SHUFFLE2+LFT" | "SHUFFLE2+RGT" | "SHUFFLE2+MIR" |
  "SHUFFLE3 (↑←)" | "SHUFFLE3+LFT" | "SHUFFLE3+RGT" | "SHUFFLE3+MIR" |
  "SHUFFLE4 (→↑)" | "SHUFFLE4+LFT" | "SHUFFLE4+RGT" | "SHUFFLE4+MIR" |
  "SHUFFLE5 (↑↓)" | "SHUFFLE5+LFT" | "SHUFFLE5+RGT" | "SHUFFLE5+MIR (→←)";
