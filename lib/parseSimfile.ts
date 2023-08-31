import * as fs from "fs";
import * as path from "path";
import { parseDwi } from "./parseDwi";
import { parseSm } from "./parseSm";
import { calculateStats } from "./calculateStats";

type RawSimfile = Omit<Simfile, "title"> & {
  title: string;
  titletranslit: string | null;
  displayBpm: string | undefined;
};
type Parser = (simfileSource: string, titleDir: string) => RawSimfile;

const INTRO_OFFSET = 2;

const parsers: Record<string, Parser> = {
  ".sm": parseSm,
  ".dwi": parseDwi,
};

function getSongFile(songDir: string): string {
  const files = fs.readdirSync(songDir);

  // TODO: support more than .sm
  const extensions = Object.keys(parsers);

  const songFile = files.find((f) => extensions.some((ext) => f.endsWith(ext)));

  if (!songFile) {
    throw new Error(`No song file found in ${songDir}`);
  }

  return songFile;
}

function getBpms(sm: RawSimfile): number[] {
  const chart = Object.values(sm.charts)[0];

  return chart.bpm.map((b) => b.bpm);
}

const mapObject = <K extends string | number | symbol, V, W>(
  obj: Record<K, V>,
  fn: (arg: V) => W,
): Record<K, W> => (
  Object.fromEntries((Object.keys(obj) as K[]).map((k) => [k, fn(obj[k])])) as Record<K, W>
);

function parseSimfile(
  rootDir: string,
  mixDir: string,
  titleDir: string
): Simfile {
  const stepchartSongDirPath = path.join(rootDir, mixDir, titleDir);
  const songFile = getSongFile(stepchartSongDirPath);
  const stepchartPath = path.join(stepchartSongDirPath, songFile);
  const extension = path.extname(stepchartPath);

  const parser = parsers[extension];

  if (!parser) {
    throw new Error(`No parser registered for extension: ${extension}`);
  }

  const fileContents = fs.readFileSync(stepchartPath);
  const rawStepchart = parser(fileContents.toString(), stepchartSongDirPath);

  const bpms = getBpms(rawStepchart);
  const minBpm = Math.round(Math.min(...bpms));
  const maxBpm = Math.round(Math.max(...bpms));

  const displayBpm =
    minBpm === maxBpm ? minBpm.toString() : `${minBpm}-${maxBpm}`;

  return {
    ...rawStepchart,
    title: {
      titleName: rawStepchart.title,
      translitTitleName: rawStepchart.titletranslit ?? null,
      titleDir,
      banner: rawStepchart.banner,
    },
    artist: rawStepchart.artist,
    availableTypes: rawStepchart.availableTypes,
    // the default type definition of .fromEntries in typescript is too weak
    // to make this type-safe.
    stats: mapObject(rawStepchart.charts, calculateStats),
    topDifficulty: rawStepchart.availableTypes.reduce((l, r) => (
      r.feet < l.feet ? l : r
    ), { feet: 0, difficulty: "beginner" }).difficulty,
    charts: mapObject(rawStepchart.charts, (chart) => ({
      arrows: chart.arrows.map((arrow) => ({
        ...arrow,
        offset: arrow.offset + INTRO_OFFSET,
      })),
      freezes: chart.freezes.map((freeze) => ({
        ...freeze,
        startOffset: freeze.startOffset + INTRO_OFFSET,
        endOffset: freeze.endOffset + INTRO_OFFSET,
      })),
      bpm: chart.bpm.map((bpm, ix) => (ix === 0 ? bpm : {
        ...bpm,
        startOffset: bpm.startOffset + INTRO_OFFSET,
        endOffset: bpm.endOffset != null ? bpm.endOffset + INTRO_OFFSET : null,
      })),
      stops: chart.stops.map((stop) => ({
        ...stop,
        offset: stop.offset + INTRO_OFFSET,
      })),
    })),
    minBpm,
    maxBpm,
    displayBpm,
    stopCount: Object.values(rawStepchart.charts)[0].stops.length,
  };
}

export { parseSimfile };
export type { RawSimfile };
