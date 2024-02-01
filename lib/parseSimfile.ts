import * as fs from "fs";
import * as path from "path";
import { parseDwi } from "./parseDwi";
import { parseSm } from "./parseSm";

// TODO: round bpms and stops

type RawSimfile = Omit<Simfile, "title"> & {
  title: string;
  titletranslit: string | null;
};
type Parser = (simfileSource: string, titleDir: string) => RawSimfile;

const INTRO_OFFSET = 1;

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

  return {
    ...rawStepchart,
    title: {
      titleName: rawStepchart.title,
      translitTitleName: rawStepchart.titletranslit ?? null,
      titleDir,
    },
    artist: rawStepchart.artist,
    availableTypes: rawStepchart.availableTypes,
    charts: mapObject(rawStepchart.charts, (chart) => ({
      arrows: chart.arrows.map((arrow) => ({
        ...arrow,
        offset: arrow.offset.add(INTRO_OFFSET),
      })),
      freezes: chart.freezes.map((freeze) => ({
        ...freeze,
        startOffset: freeze.startOffset.add(INTRO_OFFSET),
        endOffset: freeze.endOffset.add(INTRO_OFFSET),
      })),
      bpm: chart.bpm.map((bpm) => ({
        ...bpm,
        startOffset: bpm.startOffset.add(INTRO_OFFSET),
        endOffset: bpm.endOffset?.add(INTRO_OFFSET),
      })).filter((bpm, ix) => (
        !chart.bpm[ix + 1] || chart.bpm[ix + 1].startOffset.compare(0) > 0
      )),
      stops: chart.stops.map((stop) => ({
        ...stop,
        offset: stop.offset.add(INTRO_OFFSET),
      })).filter((stop) => stop.offset.compare(0) > 0),
    })),
  };
}

export { parseSimfile };
export type { RawSimfile };
