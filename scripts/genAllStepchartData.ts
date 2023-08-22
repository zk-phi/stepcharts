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
  id: mix.mixDir,
  name: mix.mixName,
  shortName: mix.shortMixName,
  year: mix.yearReleased,
  bannerSrc: mix.banner,
  songs: mix.simfiles.length,
});

const legacySongToSongMeta = (song: Simfile) => ({
  id: song.title.titleDir,
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

export type AllMixesData = (MixMeta & { songs: number })[];
const allMixesData: AllMixesData = data.map(legacyMixToMixMeta);
fs.writeFileSync(`_data/allMixes.json`, JSON.stringify(allMixesData));

export type AllChartsData = ({
  mix: MixMeta,
  song: SongMeta,
  chart: ChartMeta,
  filterString: string,
})[];
const allChartsData: AllChartsData = data.flatMap((mix) => (
  mix.simfiles.flatMap((simfile) => (
    simfile.availableTypes.map((chartType) => ({
      mix: legacyMixToMixMeta(mix),
      song: legacySongToSongMeta(simfile),
      chart: legacyChartToChartMeta(simfile, chartType),
      filterString: [
        simfile.title.translitTitleName,
        simfile.title.titleName,
        mix.mixName,
        simfile.artist,
        chartType.difficulty,
      ].join(" ").toLowerCase(),
    }))
  ))
))
fs.writeFileSync(`_data/allCharts.json`, JSON.stringify(allChartsData));

export type MixData = MixMeta & {
  songs: (SongMeta & {
    charts: ChartMeta[],
  })[],
};
data.forEach((mix) => {
  if (!fs.existsSync(`_data/${mix.mixDir}`)) {
    fs.mkdirSync(`_data/${mix.mixDir}`);
  }
  const mixData: MixData = {
    ...legacyMixToMixMeta(mix),
    songs: mix.simfiles.map((simfile) => ({
      ...legacySongToSongMeta(simfile),
      charts: simfile.availableTypes.map((chartType) => (
        legacyChartToChartMeta(simfile, chartType)
      )),
    })),
  };
  fs.writeFileSync(`_data/${mix.mixDir}/data.json`, JSON.stringify(mixData));
});

export type SongData = {
  mix: MixMeta,
  song: SongMeta & { charts: ChartMeta[] },
};
data.forEach((mix) => {
  mix.simfiles.forEach((simfile) => {
    if (!fs.existsSync(`_data/${mix.mixDir}/${simfile.title.titleDir}`)) {
      fs.mkdirSync(`_data/${mix.mixDir}/${simfile.title.titleDir}`);
    }
    const songData: SongData = {
      mix: legacyMixToMixMeta(mix),
      song: {
        ...legacySongToSongMeta(simfile),
        charts: simfile.availableTypes.map((chartType) => (
          legacyChartToChartMeta(simfile, chartType)
        )),
      },
    };
    fs.writeFileSync(
      `_data/${mix.mixDir}/${simfile.title.titleDir}/data.json`,
      JSON.stringify(songData),
    );
  });
});

export type ChartData = {
  mix: MixMeta,
  song: SongMeta,
  chart: Stepchart & { meta: ChartMeta },
};
data.forEach((mix) => {
  mix.simfiles.forEach((simfile) => {
    simfile.availableTypes.forEach((chartType) => {
      const chartData: ChartData = {
        mix: legacyMixToMixMeta(mix),
        song: legacySongToSongMeta(simfile),
        chart: {
          ...simfile.charts[chartType.difficulty],
          meta: legacyChartToChartMeta(simfile, chartType),
        },
      };
      fs.writeFileSync(
        `_data/${mix.mixDir}/${simfile.title.titleDir}/${chartType.difficulty}.json`,
        JSON.stringify(chartData),
      );
    });
  });
});
