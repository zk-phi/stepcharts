import fs from "fs";
import Fraction from "fraction.js";
import { RawSimfile, normalizedDifficultyMap } from "./common";
import { bpmFrac, offsetFrac } from "../../constants/precision";
import { determineBeat, mergeSameBpms } from "../util";

const metaTagsToConsume = ["title", "artist"];

const dwiToSMDirection: Record<string, Arrow["direction"]> = {
  0: "0000",
  1: "1100", // down-left
  2: "0100", // down
  3: "0101", // down-right
  4: "1000", // left
  6: "0001", // right
  7: "1010", // up-left
  8: "0010", // up
  9: "0011", // up-right
  A: "0110", // up-down jump
  B: "1001", // left-right jump
};

const smToDwiDirection = Object.entries(dwiToSMDirection).reduce<
  Record<string, string>
>((building, entry) => {
  building[entry[1]] = entry[0];
  return building;
}, {});

type ArrowParseResult = {
  arrows: Arrow[];
  freezes: FreezeBody[];
};

function findFirstNonEmptyMeasure(
  p1Notes: string,
  p2Notes: string | undefined
): number {
  let i = 0;

  while (
    p1Notes.startsWith("00000000") &&
    (!p2Notes || p2Notes.startsWith("00000000"))
  ) {
    p1Notes = p1Notes.substring(8);
    p2Notes = p2Notes?.substring(8);
    i += 8;
  }

  return i;
}

function parseArrowStream(
  notes: string,
  firstNonEmptyMeasureIndex: number
): ArrowParseResult {
  const arrows: Arrow[] = [];
  const freezes: FreezeBody[] = [];

  let currentFreezeDirections: string[] = [];
  const openFreezes: Record<
    FreezeBody["direction"],
    Partial<FreezeBody> | null
  > = {
    0: null,
    1: null,
    2: null,
    3: null,
  };

  let curOffset = new Fraction(0);
  // dwi's default increment is 8th notes
  let curMeasureFraction = new Fraction(1).div(8);

  for (
    let i = firstNonEmptyMeasureIndex;
    i < notes.length && notes[i] !== ";";
    ++i
  ) {
    let note = notes[i];
    const nextNote = notes[i + 1];

    const smDirection = dwiToSMDirection[note];

    // give the current note a chance to conclude any freezes that may be pending
    if (smDirection) {
      const smDirectionSplit = smDirection.split("");
      for (let d = 0; d < smDirection.length; ++d) {
        if (
          smDirection[d] === "1" &&
          openFreezes[d as FreezeBody["direction"]]
        ) {
          const of = openFreezes[d as FreezeBody["direction"]];
          of!.endOffset = curOffset;
          freezes.push(of as FreezeBody);
          openFreezes[d as FreezeBody["direction"]] = null;
          smDirectionSplit[d] = "0";
        }
      }

      note = smToDwiDirection[smDirectionSplit.join("")];
    }

    if (nextNote === "!") {
      // B!602080B
      // this means the freeze starts with B (left and right), but then only right (6) has the freeze body
      // during the freeze there is down (2) then up (8), concluding with the second B

      const freezeNote = notes[i + 2];

      const smDirection = dwiToSMDirection[freezeNote];

      for (let d = 0; d < smDirection.length; ++d) {
        if (smDirection[d] === "1") {
          openFreezes[d as FreezeBody["direction"]] = {
            direction: d as FreezeBody["direction"],
            startOffset: curOffset,
          };
        }
      }

      // the head of a freeze is still an arrow
      arrows.push({
        direction: dwiToSMDirection[note].replace(
          /1/g,
          "2"
        ) as Arrow["direction"],
        beat: determineBeat(curOffset),
        offset: curOffset,
      });

      // remember the direction to know when to close the freeze
      currentFreezeDirections.push(freezeNote);

      // move past the exclamation and trailing note
      i += 2;
      curOffset = curOffset.add(curMeasureFraction);
    } else if (note === "(") {
      curMeasureFraction = new Fraction(1).div(16);
    } else if (note === "[") {
      curMeasureFraction = new Fraction(1).div(24);
    } else if (note === "{") {
      curMeasureFraction = new Fraction(1).div(64);
    } else if (note === "`") {
      curMeasureFraction = new Fraction(1).div(192);
    } else if ([")", "]", "}", "'"].includes(note)) {
      curMeasureFraction = new Fraction(1).div(8);
    } else if (note === "0") {
      curOffset = curOffset.add(curMeasureFraction);
    } else {
      const direction = dwiToSMDirection[note];

      if (direction) {
        arrows.push({
          direction,
          beat: determineBeat(curOffset),
          offset: curOffset,
        });
      }

      curOffset = curOffset.add(curMeasureFraction);
    }
  }

  return { arrows, freezes };
}

function parseDwi(dwi: string, titlePath?: string): RawSimfile {
  let bpm: string | null = null;
  let changebpm: string | null = null;
  let stops: string | null = null;

  const lines = dwi.split("\n").map((l) => l.trim());

  let i = 0;

  const sc: Partial<RawSimfile> = {
    charts: {},
    availableTypes: [],
  };

  function parseNotes(rawNotes: string) {
    const values = rawNotes.split(":");
    const difficulty = normalizedDifficultyMap[values[0].toLowerCase()];
    const feet = Number(values[1]);
    const notes = values[2];
    const playerTwoNotes = values[3];

    const firstNonEmptyMeasureIndex = findFirstNonEmptyMeasure(
      notes,
      playerTwoNotes
    );

    let arrowResult = parseArrowStream(notes, firstNonEmptyMeasureIndex);

    sc.availableTypes!.push({
      difficulty: difficulty as any,
      feet,
    });

    sc.charts![difficulty] = {
      arrows: arrowResult.arrows,
      freezes: arrowResult.freezes,
      bpm: determineBpm(firstNonEmptyMeasureIndex),
      stops: determineStops(firstNonEmptyMeasureIndex),
    };
  }

  function determineStops(emptyOffset: number) {
    if (!stops) {
      return [];
    }

    return stops.split(",").map((s) => {
      const [eigthNoteS, stopDurationS] = s.split("=");
      const offset = offsetFrac(Number(eigthNoteS) / 16 - emptyOffset / 8);

      return {
        offset,
        duration: new Fraction(Number(stopDurationS), 1000),
      };
    });
  }

  function determineBpm(emptyOffset: number) {
    let finalBpms: Bpm[] = [];

    if (bpm && !isNaN(Number(bpm))) {
      finalBpms = [{
        startOffset: new Fraction(0),
        endOffset: null,
        bpm: bpmFrac(Number(bpm)),
      }];
    }

    if (changebpm) {
      if (!finalBpms) {
        throw new Error("parseDwi: a simfile has changebpm but not bpm");
      }

      const entries = changebpm.split(",");
      const additionalBpms = entries.map((bpmES, i, a) => {
        const [eigthNoteS, bpmVS] = bpmES.split("=");
        const nextEigthNoteS = a[i + 1]?.split("=")[0] ?? null;

        const startOffset = offsetFrac(Number(eigthNoteS) / 16 - emptyOffset / 8);
        let endOffset = null;

        if (nextEigthNoteS) {
          endOffset = offsetFrac(Number(nextEigthNoteS) / 16 - emptyOffset / 8);
        }

        return {
          startOffset,
          endOffset,
          bpm: bpmFrac(Number(bpmVS)),
        };
      });

      finalBpms = finalBpms.concat(additionalBpms);
      finalBpms[0].endOffset = finalBpms[1].startOffset;
    }

    if (!finalBpms) {
      throw new Error("parseDwi, determineBpm: failed to get bpm");
    }

    return mergeSameBpms(finalBpms);
  }

  function parseTag(lines: string[], index: number): number {
    const line = lines[index];

    const r = /#([A-Za-z]+):([^;]*)/;
    const result = r.exec(line);

    if (result) {
      const tag = result[1].toLowerCase();
      const value = result[2];

      if (metaTagsToConsume.includes(tag)) {
        // @ts-ignore
        sc[tag] = value;
      } else if (tag === "bpm") {
        bpm = value;
      } else if (tag === "changebpm") {
        changebpm = value;
      } else if (tag === "freeze") {
        stops = value;
      } else if (tag === "single") {
        parseNotes(value);
      }
    }

    return index + 1;
  }

  try {
    while (i < lines.length) {
      const line = lines[i];

      if (!line.length || line.startsWith("//")) {
        i += 1;
        continue;
      }

      if (line.startsWith("#")) {
        i = parseTag(lines, i);
      } else {
        i += 1;
      }
    }

    if (!bpm) {
      throw new Error(`No BPM found for ${titlePath}`);
    }

    return sc as RawSimfile;
  } catch (e) {
    throw new Error(`error, ${e.message}, ${e.stack}, parsing ${dwi}`);
  }
}

export { parseDwi };
