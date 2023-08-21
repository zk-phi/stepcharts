import * as fs from "fs";
import * as path from "path";
import { toSafeName } from "./util";
import { parseDwi } from "./parseDwi";
import { parseSm } from "./parseSm";
import { calculateStats } from "./calculateStats";

type RawSimfile = Omit<Simfile, "mix" | "title"> & {
  title: string;
  titletranslit: string | null;
  banner: string | null;
  displayBpm: string | undefined;
};
type Parser = (simfileSource: string, titleDir: string) => RawSimfile;

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

function parseSimfileAndCopyBanners(
  rootDir: string,
  mixDir: string,
  titleDir: string
): Omit<Simfile, "mix"> {
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

  if (
    rawStepchart.banner &&
    fs.existsSync(path.join(stepchartSongDirPath, rawStepchart.banner))
  ) {
    const publicName = toSafeName(`${mixDir}-${rawStepchart.banner}`);
    fs.copyFileSync(
      path.join(stepchartSongDirPath, rawStepchart.banner),
      path.join("public/bannerImages", publicName)
    );
    rawStepchart.banner = `/bannerImages/${publicName}`;
  } else {
    rawStepchart.banner = null;
  }

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
    // the default type definition of .fromEntries in typescript is too weak
    // to make this type-safe.
    stats: Object.fromEntries(rawStepchart.availableTypes.map((dif) => ([
      dif.difficulty,
      calculateStats(rawStepchart.charts[dif.difficulty]),
    ]))) as Record<Difficulty, Stats>,
    topDifficulty: rawStepchart.availableTypes.reduce((l, r) => (
      r.feet < l.feet ? l : r
    ), { feet: 0, difficulty: "beginner" }).difficulty,
    minBpm,
    maxBpm,
    displayBpm,
    stopCount: Object.values(rawStepchart.charts)[0].stops.length,
  };
}

export { parseSimfileAndCopyBanners };
export type { RawSimfile };
