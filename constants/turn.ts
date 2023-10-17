export const TURNS = [
  "OFF",
  "LEFT",
  "RIGHT",
  "MIRROR",
  "SHUFFLE1 (→↑)",
  "SHUFFLE1+LFT",
  "SHUFFLE1+RGT",
  "SHUFFLE1+MIR",
  "SHUFFLE2 (↓←)",
  "SHUFFLE2+LFT",
  "SHUFFLE2+RGT",
  "SHUFFLE2+MIR",
  "SHUFFLE3 (↑←)",
  "SHUFFLE3+LFT",
  "SHUFFLE3+RGT",
  "SHUFFLE3+MIR",
  "SHUFFLE4 (→↑)",
  "SHUFFLE4+LFT",
  "SHUFFLE4+RGT",
  "SHUFFLE4+MIR",
  "SHUFFLE5 (↑↓)",
  "SHUFFLE5+LFT",
  "SHUFFLE5+RGT",
  "SHUFFLE5+MIR (→←)",
];

export const TURN_VALUES = {
  "OFF":               [0, 1, 2, 3],
  "LEFT":              [2, 0, 3, 1],
  "RIGHT":             [1, 3, 0, 2],
  "MIRROR":            [3, 2, 1, 0],
  "SHUFFLE1 (→↑)":     [0, 1, 3, 2], // 2-3
  "SHUFFLE1+LFT":      [3, 0, 2, 1],
  "SHUFFLE1+RGT":      [1, 2, 0, 3],
  "SHUFFLE1+MIR":      [2, 3, 1, 0],
  "SHUFFLE2 (↓←)":     [1, 0, 2, 3], // 0-1
  "SHUFFLE2+LFT":      [2, 1, 3, 0],
  "SHUFFLE2+RGT":      [0, 3, 1, 2],
  "SHUFFLE2+MIR":      [3, 2, 0, 1],
  "SHUFFLE3 (↑←)":     [2, 1, 0, 3], // 0-2
  "SHUFFLE3+LFT":      [0, 2, 3, 1],
  "SHUFFLE3+RGT":      [1, 3, 2, 0],
  "SHUFFLE3+MIR":      [3, 0, 1, 2],
  "SHUFFLE4 (→↑)":     [0, 3, 2, 1], // 1-3
  "SHUFFLE4+LFT":      [2, 0, 1, 3],
  "SHUFFLE4+RGT":      [3, 1, 0, 2],
  "SHUFFLE4+MIR":      [1, 2, 3, 0],
  "SHUFFLE5 (↑↓)":     [0, 2, 1, 3], // 1-2
  "SHUFFLE5+LFT":      [1, 0, 3, 2],
  "SHUFFLE5+RGT":      [2, 3, 0, 1],
  "SHUFFLE5+MIR (→←)": [3, 1, 2, 0], // 0-3
};
