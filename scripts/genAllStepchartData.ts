import * as fs from "fs";
import * as path from "path";
import { parseSimfile } from "../lib/parseSimfile";
import { dateReleased, shortMixNames } from "../lib/meta";
import { findMainBpm } from "../lib/analyzeRhythmComplexity";

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
  const mixSongDirs = getDirectories(ROOT, mixDir);

  return {
    meta: {
      mixId: mixDir,
      name: mixDir.replace(/-/g, " "),
      shortName: shortMixNames[mixDir],
      year: new Date(dateReleased[mixDir]).getFullYear(),
      songs: mixSongDirs.length,
    },
    songs: mixSongDirs.map((songDir) => {
      console.log(`Parsing ${mixDir}/${songDir} ...`);
      const simfile = parseSimfile(ROOT, mixDir, songDir);
      return {
        meta: {
          songId: simfile.title.titleDir,
          title: simfile.title.titleName,
          titleTranslit: simfile.title.translitTitleName,
          artist: simfile.artist,
          minBpm: simfile.minBpm,
          maxBpm: simfile.maxBpm,
          displayBpm: simfile.displayBpm,
        },
        charts: simfile.availableTypes.map((chartType: StepchartType) => ({
          meta: {
            difficulty: chartType.difficulty,
            level: chartType.feet,
            arrows: simfile.charts[chartType.difficulty].arrows.length,
            stops: simfile.charts[chartType.difficulty].stops.length,
            bpmShifts: simfile.charts[chartType.difficulty].bpm.length - 1,
            mainBpm: Math.round(findMainBpm(simfile.charts[chartType.difficulty])),
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
console.log(`Writing _data/mixes.json ...`);
fs.writeFileSync(`public/_data/mixes.json`, JSON.stringify(allMixesData));

const index: Index = allData.map((mix) => ({
  id: mix.meta.mixId,
  songs: mix.songs.map((song) => ({
    id: song.meta.songId,
    charts: song.charts.map((chart) => ({
      difficulty: chart.meta.difficulty,
    })),
  })),
}));
console.log(`Writing _data/index.json ...`);
fs.writeFileSync(`public/_data/index.json`, JSON.stringify(index));

const allMixes: AllMeta[] = allData.flatMap((mix) => {
  if (!fs.existsSync(`public/_data/${mix.meta.mixId}`)) {
    fs.mkdirSync(`public/_data/${mix.meta.mixId}`);
  }
  const allSongs = mix.songs.flatMap((song) => {
    if (!fs.existsSync(`public/_data/${mix.meta.mixId}/${song.meta.songId}`)) {
      fs.mkdirSync(`public/_data/${mix.meta.mixId}/${song.meta.songId}`);
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
      console.log(
        `Writing _data/${mix.meta.mixId}/${song.meta.songId}/${chart.meta.difficulty}.json ...`
      );
      fs.writeFileSync(
        `public/_data/${mix.meta.mixId}/${song.meta.songId}/${chart.meta.difficulty}.json`,
        JSON.stringify(chartData),
      );
      return allMeta;
    });
    console.log(`Writing _data/${mix.meta.mixId}/${song.meta.songId}/all.json ...`);
    fs.writeFileSync(
      `public/_data/${mix.meta.mixId}/${song.meta.songId}/all.json`,
      JSON.stringify(allCharts),
    );
    return allCharts;
  });
  console.log(`Writing _data/${mix.meta.mixId}/all.json ...`);
  fs.writeFileSync(`public/_data/${mix.meta.mixId}/all.json`, JSON.stringify(allSongs));
  return allSongs;
});
console.log(`Writing _data/all.json ...`);
fs.writeFileSync(`public/_data/all.json`, JSON.stringify(allMixes));
