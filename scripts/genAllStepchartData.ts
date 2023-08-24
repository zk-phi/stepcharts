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

const legacyMixToMixMeta = (mix: EntireMix) => ({
  mixId: mix.mixDir,
  name: mix.mixName,
  shortName: mix.shortMixName,
  year: mix.yearReleased,
  bannerSrc: mix.banner,
  songs: mix.simfiles.length,
});

const legacySongToSongMeta = (song: Simfile) => ({
  songId: song.title.titleDir,
  title: song.title.titleName,
  titleTranslit: song.title.translitTitleName,
  artist: song.artist,
  minBpm: song.minBpm,
  maxBpm: song.maxBpm,
  displayBpm: song.displayBpm,
  bannerSrc: song.title.banner,
});

const legacyChartToChartMeta = (song: Simfile, chartType: StepchartType) => ({
  difficulty: chartType.difficulty,
  level: chartType.feet,
  arrows: song.charts[chartType.difficulty].arrows.length,
  stops: song.charts[chartType.difficulty].stops.length,
  bpmShifts: song.charts[chartType.difficulty].bpm.length - 1,
  ...song.stats[chartType.difficulty],
})

const allMixesData: MixMeta[] = data.map(legacyMixToMixMeta);
fs.writeFileSync(`_data/mixes.json`, JSON.stringify(allMixesData));

const allMixes: AllMeta[] = data.flatMap((mix) => {
  if (!fs.existsSync(`_data/${mix.mixDir}`)) {
    fs.mkdirSync(`_data/${mix.mixDir}`);
  }
  const mixMeta = legacyMixToMixMeta(mix);
  const allSongs = mix.simfiles.flatMap((simfile) => {
    if (!fs.existsSync(`_data/${mix.mixDir}/${simfile.title.titleDir}`)) {
      fs.mkdirSync(`_data/${mix.mixDir}/${simfile.title.titleDir}`);
    }
    const songMeta = legacySongToSongMeta(simfile);
    const allCharts: AllMeta[] = simfile.availableTypes.map((chartType) => {
      const allMeta = {
        ...mixMeta,
        ...songMeta,
        ...legacyChartToChartMeta(simfile, chartType),
        filterString: [
          simfile.title.translitTitleName,
          simfile.title.titleName,
          mix.mixName,
          simfile.artist,
          chartType.difficulty,
        ].join(" ").toLowerCase(),
      };
      const chartData: ChartData = {
        meta: allMeta,
        ...simfile.charts[chartType.difficulty],
      };
      fs.writeFileSync(
        `_data/${mix.mixDir}/${simfile.title.titleDir}/${chartType.difficulty}.json`,
        JSON.stringify(chartData),
      );
      return allMeta;
    });
    fs.writeFileSync(
      `_data/${mix.mixDir}/${simfile.title.titleDir}/all.json`,
      JSON.stringify(allCharts),
    );
    return allCharts;
  });
  fs.writeFileSync(`_data/${mix.mixDir}/all.json`, JSON.stringify(allSongs));
  return allSongs;
});
fs.writeFileSync(`_data/all.json`, JSON.stringify(allMixes));
