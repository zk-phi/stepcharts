import * as fs from "fs";
import * as path from "path";
import { toSafeName } from "../lib/util";
import { parseSimfileAndCopyBanners } from "../lib/parseSimfile";
import { dateReleased, shortMixNames } from "../lib/meta";

const ROOT = "resources/stepcharts";

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

type AllData = {
  meta: MixMeta,
  songs: {
    meta: SongMeta,
    charts: {
      meta: ChartMeta,
      chart: Stepchart,
    }[],
  }[],
}[];

const mixDirs = getDirectories(ROOT);

const allData: AllData = mixDirs.map((mixDir) => {
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

  return {
    meta: {
      mixId: mixDir,
      name: mixDir.replace(/-/g, " "),
      shortName: shortMixNames[mixDir],
      year: new Date(dateReleased[mixDir]).getFullYear(),
      bannerSrc: banner,
      songs: mixSongDirs.length,
    },
    songs: mixSongDirs.map((songDir) => {
      const simfile = parseSimfileAndCopyBanners(ROOT, mixDir, songDir);
      return {
        meta: {
          songId: simfile.title.titleDir,
          title: simfile.title.titleName,
          titleTranslit: simfile.title.translitTitleName,
          artist: simfile.artist,
          minBpm: simfile.minBpm,
          maxBpm: simfile.maxBpm,
          displayBpm: simfile.displayBpm,
          bannerSrc: simfile.title.banner,
        },
        charts: simfile.availableTypes.map((chartType) => ({
          meta: {
            difficulty: chartType.difficulty,
            level: chartType.feet,
            arrows: simfile.charts[chartType.difficulty].arrows.length,
            stops: simfile.charts[chartType.difficulty].stops.length,
            bpmShifts: simfile.charts[chartType.difficulty].bpm.length - 1,
            ...simfile.stats[chartType.difficulty],
          },
          chart: simfile.charts[chartType.difficulty],
        })),
      };
    }),
  };
}).sort((a, b) => (
  a.meta.year - b.meta.year
));

const allMixesData: MixMeta[] = allData.map((mix) => mix.meta);
fs.writeFileSync(`_data/mixes.json`, JSON.stringify(allMixesData));

const index: Index = allData.map((mix) => ({
  id: mix.meta.mixId,
  songs: mix.songs.map((song) => ({
    id: song.meta.songId,
    charts: song.charts.map((chart) => ({
      difficulty: chart.meta.difficulty,
    })),
  })),
}));
fs.writeFileSync(`_data/index.json`, JSON.stringify(index));

const allMixes: AllMeta[] = allData.flatMap((mix) => {
  if (!fs.existsSync(`_data/${mix.meta.mixId}`)) {
    fs.mkdirSync(`_data/${mix.meta.mixId}`);
  }
  const allSongs = mix.songs.flatMap((song) => {
    if (!fs.existsSync(`_data/${mix.meta.mixId}/${song.meta.songId}`)) {
      fs.mkdirSync(`_data/${mix.meta.mixId}/${song.meta.songId}`);
    }
    const allCharts: AllMeta[] = song.charts.map((chart) => {
      const allMeta = {
        ...mix.meta,
        ...song.meta,
        ...chart.meta,
        filterString: [
          song.meta.titleTranslit,
          song.meta.title,
          mix.meta.name,
          song.meta.artist,
          chart.meta.difficulty,
        ].join(" ").toLowerCase(),
      };
      const chartData: ChartData = {
        meta: allMeta,
        ...chart.chart,
      };
      fs.writeFileSync(
        `_data/${mix.meta.mixId}/${song.meta.songId}/${chart.meta.difficulty}.json`,
        JSON.stringify(chartData),
      );
      return allMeta;
    });
    fs.writeFileSync(
      `_data/${mix.meta.mixId}/${song.meta.songId}/all.json`,
      JSON.stringify(allCharts),
    );
    return allCharts;
  });
  fs.writeFileSync(`_data/${mix.meta.mixId}/all.json`, JSON.stringify(allSongs));
  return allSongs;
});
fs.writeFileSync(`_data/all.json`, JSON.stringify(allMixes));
