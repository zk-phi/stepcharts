import Fraction from "fraction.js";
import { canonicalBpm } from "./analyzers/computeCanonicalChart";
import { STOP_QUANTIZATION_THRESHOLD } from "../constants/precision";
import { doffsetToTime, dtimeToOffset } from "./util";

// Quantize inaccurate stop durations hard-coded in simfiles.
// The quantizer first try to quantize a duration to either 12th or 16th.
// If it fails (= both candidates violates the threshold), try 24th or 32nd instead.
//
// The quantizer accepts at most two possible BPMs, and determines which is appropreate.
// This may useful to resolve ambiguity caused by a "stop and bpm-shift at the same beat".
// (It's' unclear whether it's a "shift-then-stop" or "stop-then-shift")

// Simply quantize the given duration, and return with some hints.
const _quantizeDuration = (
  duration: Fraction,
  bpm: Fraction,
  to: string,
): [Fraction, { stopBpm: Fraction, stopDuration: string }] => {
  const [cBpm, bpmMult] = canonicalBpm(bpm);
  const offset = dtimeToOffset(duration, cBpm);
  const quantizedOffset = offset.roundTo(to);
  const quantizedDuration = doffsetToTime(quantizedOffset, cBpm);
  return [quantizedDuration, {
    stopBpm: bpm,
    stopDuration: quantizedOffset.div(bpmMult).toFraction(true),
  }];
}

// Check if the quantized duration satisfies the threshold.
// Returns result as a boolean value.
// If VERBOSE is true, show warning message when the quantization violates the threshold.
export const verifyQuantization = (
  duration: Fraction,
  stops: [Fraction, { stopBpm: Fraction, stopDuration: string }][],
  verbose?: boolean,
): boolean => {
  const total = stops.reduce((l, r) => l.add(r[0]), new Fraction(0));
  if (duration.sub(total).abs().compare(STOP_QUANTIZATION_THRESHOLD) <= 0) {
    return true;
  } else {
    if (verbose) {
      console.log(
        `WARNING: Quantization violates the threshold:\n`
        +`- duration: ${duration} -> ${total} (err: ${total.sub(duration).mul(60)}f @60fps)\n`
        + stops.map((s) => `- ${s[1].stopDuration} @${s[1].stopBpm}`).join("\n")
      );
    }
    return false;
  }
}

// Find appropreate quantization from candidates.
// If no candidates satisfies the threshold, this function fails with an error.
export const fixStopDuration = (
  ix: number,
  duration: Fraction,
  bpm1: Fraction,
  bpm2?: Fraction,
  _conservative = false,
): [Fraction, { stopBpm: Fraction, stopDuration: string }] => {
  const candidates = [];
  candidates.push(_quantizeDuration(duration, bpm1, _conservative ? "1/32" : "1/16"));
  candidates.push(_quantizeDuration(duration, bpm1, _conservative ? "1/24" : "1/12"));
  if (bpm2) {
    candidates.push(_quantizeDuration(duration, bpm2, _conservative ? "1/32" : "1/16"));
    candidates.push(_quantizeDuration(duration, bpm2, _conservative ? "1/24" : "1/12"));
  }
  const accepted = candidates.filter((c) => (
    verifyQuantization(duration, [c])
  )).filter((c, i, cs) => (
    // remove duplications
    i === 0 || !c[0].equals(cs[i - 1][0])
  ));
  if (accepted.length === 1) {
    return accepted[0];
  } else if (accepted.length === 0 && !_conservative) {
    return fixStopDuration(ix, duration, bpm1, bpm2, true);
  } else {
    throw new Error(
      `Cannot quantize stop:\n- index: ${ix}\n- duration: ${duration}\nCandidates:\n`
      + candidates.map((c) => (
        `${c[1].stopDuration} @${c[1].stopBpm} (err: ${c[0].sub(duration).mul(60)}f @60fps)`
      )).join("\n")
    );
  }
};
