import * as fs from "fs";
import * as path from "path";
import { toSafeName } from "../lib/util";
import { parseSimfileAndCopyBanners } from "../lib/parseSimfile";
import { dateReleased, shortMixNames } from "../lib/meta";

const ROOT = "resources/stepcharts";

type EntireMix = Mix & {
  simfiles: Simfile[];
};

function getFiles(...dirPath: string[]): string[] {
  const builtPath = dirPath.reduce((building, d) => {
    return path.join(building, d);
  }, "");

  return fs.readdirSync(builtPath);
}

function getDirectories(...dirPath: string[]): string[] {
  const builtPath = dirPath.reduce((building, d) => {
    return path.join(building, d);
  }, "");

  return getFiles(builtPath).filter((d) => {
    return fs.statSync(path.join(builtPath, d)).isDirectory();
  });
}

function getAllStepchartDataAndCopyBanners(): EntireMix[] {
  const mixDirs = getDirectories(ROOT);

  return mixDirs.map((mixDir) => {
    let publicName = toSafeName(`${mixDir}.png`);
    let banner: string | null;
    if (fs.existsSync(`${ROOT}/${mixDir}/mix-banner.png`)) {
      if (!fs.existsSync(`public/bannerImages/${publicName}`)) {
        fs.copyFileSync(`${ROOT}/${mixDir}/mix-banner.png`, `public/bannerImages/${publicName}`);
      }
      banner = `/bannerImages/${publicName}`;
    } else {
      banner = null;
    }

    const mixSongDirs = getDirectories(ROOT, mixDir);

    const mix = {
      mixName: mixDir.replace(/-/g, " "),
      mixDir,
      songCount: mixSongDirs.length,
      yearReleased: new Date(dateReleased[mixDir]).getFullYear(),
      shortMixName: shortMixNames[mixDir],
      banner,
    };

    const simfiles = mixSongDirs.map((songDir) => {
      try {
        return {
          ...parseSimfileAndCopyBanners(ROOT, mixDir, songDir),
          mix,
        };
      } catch (e) {
        throw new Error(
          `parseStepchart failed for ${ROOT}/${mixDir}/${songDir}: ${e.message} ${e.stack}`
        );
      }
    });

    return {
      ...mix,
      simfiles,
    };
  }).sort((a, b) => (
    a.yearReleased - b.yearReleased
  ));
}

const data = getAllStepchartDataAndCopyBanners();

fs.writeFileSync(
  `resources/stepchartData.json`,
  JSON.stringify(data),
);

export type AllMixesData = (MixMeta & { songs: number })[];

const allMixesData: AllMixesData = data.map((mix) => ({
  id: mix.mixDir,
  name: mix.mixName,
  shortName: mix.shortMixName,
  year: mix.yearReleased,
  bannerSrc: mix.banner,
  songs: mix.simfiles.length,
}));

fs.writeFileSync(`_data/allMixes.json`, JSON.stringify(allMixesData));
