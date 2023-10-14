import * as fs from "fs";
import * as path from "path";
import { parseSimfile } from "../lib/parseSimfile";
import { dateReleased, shortMixNames } from "../lib/meta";

const ROOT = "resources/stepcharts";

const extractTimelineEvents = (chart: Stepchart): BpmEvent[] => {
  const bpmEvents = [
    ...chart.bpm.map((b) => (
      { offset: b.startOffset, bpm: b.bpm }
    )),
    ...chart.stops.map((s) => (
      { offset: s.offset, stop: s.duration }
    )),
  ].sort((a, b) => (
    a.offset - b.offset
  ));

  const timeline: BpmEvent[] = [{
    time: 0,
    offset: 0,
    // @ts-ignore `bpm` can be undefined in type-level but it must be defined actually
    bpm: bpmEvents.shift().bpm,
  }];

  bpmEvents.forEach((e) => {
    const lastBpm = timeline[0].bpm;
    const dt = (e.offset - timeline[0].offset) * 4 / lastBpm * 60;
    const time = timeline[0].time + dt;
    if ('bpm' in e) {
      timeline.unshift({ time, offset: e.offset, bpm: e.bpm });
    } else {
      timeline.unshift({ time,                offset: e.offset, bpm: 0 });
      timeline.unshift({ time: time + e.stop, offset: e.offset, bpm: lastBpm });
    }
  });

  return timeline.reverse();
};

const findMainBpm = (chart: Stepchart, bpmTimeline: BpmEvent[]) => {
  const lastOffset = chart.arrows[chart.arrows.length - 1].offset;

  const hist: Record<number, number> = {};
  bpmTimeline.forEach((event, i, arr) => {
    hist[event.bpm] = (hist[event.bpm] ?? 0) + (arr[i + 1]?.offset ?? lastOffset) - event.offset;
  });

  return Number(Object.entries(hist).reduce((l, r) => l[1] > r[1] ? l : r)[0]);
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

type AllData = {
  meta: MixMeta,
  songs: {
    meta: SongMeta,
    charts: {
      meta: ChartMeta,
      timeline: ChartTimeline,
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
          displayBpm: simfile.displayBpm,
        },
        charts: simfile.availableTypes.map((chartType: StepchartType) => {
          const chart = simfile.charts[chartType.difficulty];
          const timeline: ChartTimeline = {
            bpmTimeline: extractTimelineEvents(chart),
          };
          return {
            meta: {
              difficulty: chartType.difficulty,
              level: chartType.feet,
              arrows: chart.arrows.length,
              stops: chart.stops.length,
              bpmShifts: chart.bpm.length - 1,
              minBpm: simfile.minBpm,
              maxBpm: simfile.maxBpm,
              mainBpm: Math.round(findMainBpm(chart, timeline.bpmTimeline)),
              ...simfile.stats[chartType.difficulty],
            },
            timeline,
            chart,
          };
        }),
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
        ...chart.timeline,
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
