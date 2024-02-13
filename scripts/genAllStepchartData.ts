import * as fs from "fs";
import * as path from "path";
import Fraction from "fraction.js";
import { parseSimfile } from "../lib/parseSimfile";
import { calculateStats } from "../lib/calculateStats";
import { dateReleased, mixNames, shortMixNames } from "../lib/meta";
import {
  extractBpmEvents,
  computeArrowTimings,
  computeFreezeTimings,
  computeBeatTimings,
} from "../lib/analyzers/timingAnalyzers";
import { computeCanonicalChart } from "../lib/analyzers/computeCanonicalChart";
import { tagSoflanTriggers } from "../lib/analyzers/tagSoflanTriggers";
import { calculateBpmStats } from "../lib/analyzers/calculateBpmStats";

const ROOT = "./stepcharts-data/simfiles";

const phraseVariance = (arrowTimeline: ArrowEvent<Fraction>[]): number => {
  const table: Record<string, number> = {};
  const timings = arrowTimeline.map((arrow) => arrow.time);
  timings.forEach((_, ix) => {
    if (ix >= 2) {
      const offset1 = timings[ix].sub(timings[ix - 1]);
      const offset2 = timings[ix - 1].sub(timings[ix - 2]);
      const key = `${offset1.toString()}/${offset2.toString()}`;
      table[key] = (table[key] ?? 0) + 1;
    }
  });
  const values = Object.values(table);
  const ave = values.reduce((l, r) => l + r) / values.length;
  return Math.sqrt(values.reduce((l, r) => l + Math.pow(r - ave, 2), 0)) / timings.length;
};

// 「隙間が空いていて、かつ off-beat なノート」が難しいんだろうな
// 徐々にソフランする系も、「現在のbpmからoff」ならoff-beatと見る
// 'けど、桜のラストのジワソフランとかは、「隙間は空いていないがoff-beat」になるな
// 「off-beatの程度」という概念がありそう
// 「ひどくoff-beatな場合は隙間がさほど空いていなくても難しい」
// 「off-beat度合いランク」と「隙間の空き具合ランク」の積がそのノートの難易度になりそう
// off-beat かどうかについては、その直前のノートの bpm からいけそう？
// そのとき、 offset ではなく time を原則使う（瞬停や２倍へのソフランを無視できるので）
// ソフランについてはたとえば120-240の間にノーマライズするとかするのが良さそう
// 300 の８分は実質150の16分の気持ちで踏んでると思うので
// （倍取り譜面のリズム難が過小評価されたり、逆に低速のリズム難が過大評価されたりする）
// 低速はそもそも難しい、という話もあるが、そこはリズム難ではなく認識難なので別枠で解析すべき
//
// offset を bpm の倍取りに応じて k 倍すればよいという話ではあるかもしれない
// ジワジワ変速パート、「着地はoff-beatだが、それ以外は普通の８分として扱いたい」とかなりそう
// その時、２種類の bpm （変速前と変速後）で off-beat 判定してもよいが、
// ノートとノートの中間でも速度が変わってた場合とか、困る
// offset がブチ壊れてる曲 (chaos とか) あるのが難点ではあるが、あれは譜面がおかしいので…
// どうかしてる極少数の譜面だけ個別対応みたいのもアリだと思う
//
// あとは一度 off-beat になってから、そのまま off-beat で何拍か打つやつどう判定するか
// それが l'amour とか xenon のパターン
// 実はノートとノートの間は普通に４分なんだけど、裏に行ったままの状態で叩くので難しいやつ
// これを追跡するのは難しいかなあ……
// ５拍子とかだったらどうするのとかありそう、Holic とか
// (一見 off-beat に見えるが、拍子の方がおかしいだけで実は素直パターン)
// 小節単位じゃなく拍単位でのカウントにすればある程度行けるかなあ

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
  // console.log(`Scanning ${builtPath}`);

  const files = getFiles(builtPath);
  files.forEach((d) => {
    const filePath = path.join(builtPath, d);
    // console.log(`- ${filePath}`);
    if (!fs.statSync(filePath).isDirectory()) {
      throw new Error(`${filePath} is not a directory. Check the directory structure.`)
    }
  });

  return files;
}

type AllData = {
  meta: MixMeta,
  songs: {
    meta: SongMeta,
    charts: {
      meta: ChartMeta,
      chart: AnalyzedStepchart<number>,
      canonicalChart: AnalyzedStepchart<number>,
    }[],
  }[],
}[];

const mixDirs = getDirectories(ROOT);

const serializedChart = (chart: AnalyzedStepchart<Fraction>): AnalyzedStepchart<number> => ({
  bpmTimeline: chart.bpmTimeline.map((b: BpmEvent<Fraction>): BpmEvent<number> => ({
    bpm: b.bpm.n / b.bpm.d,
    time: b.time.n / b.time.d,
    offset: b.offset.n / b.offset.d,
    calib: b.calib.n / b.calib.d,
  })),
  arrowTimeline: chart.arrowTimeline.map((a: ArrowEvent<Fraction>): ArrowEvent<number> => ({
    ...a,
    time: a.time.n / a.time.d,
    offset: a.offset.n / a.offset.d,
  })),
  freezeTimeline: chart.freezeTimeline.map((f: FreezeEvent<Fraction>): FreezeEvent<number> => ({
    ...f,
    start: {
      time: f.start.time.n / f.start.time.d,
      offset: f.start.offset.n / f.start.offset.d,
    },
    end: {
      time: f.end.time.n / f.end.time.d,
      offset: f.end.offset.n / f.end.offset.d,
    },
  })),
  beatTimeline: chart.beatTimeline.map((b: Timestamp<Fraction>): Timestamp<number> => ({
    time: b.time.n / b.time.d,
    offset: b.offset.n / b.offset.d,
  })),
  minBpm: chart.minBpm,
  mainBpm: chart.mainBpm,
  maxBpm: chart.maxBpm,
});

const allData: AllData = mixDirs.map((mixDir) => {
  const mixSongDirs = getDirectories(ROOT, mixDir);

  return {
    meta: {
      mixId: mixDir,
      name: mixNames[mixDir],
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
          filterString: [
            simfile.title.translitTitleName,
            simfile.title.titleName,
            simfile.artist,
          ].join(" ").toLowerCase(),
        },
        charts: simfile.availableTypes.map((chartType: StepchartType) => {
          const chart = simfile.charts[chartType.difficulty];
          const stats = calculateStats(chart);
          const lastMeasure = Math.floor(chart.arrows[chart.arrows.length - 1].offset);
          const bpmTimeline = extractBpmEvents(chart);
          const arrowTimeline = computeArrowTimings(chart.arrows, bpmTimeline);
          const bpmStats = calculateBpmStats(arrowTimeline, bpmTimeline);
          const analyzedChart = {
            bpmTimeline,
            arrowTimeline,
            freezeTimeline: computeFreezeTimings(chart.freezes, bpmTimeline),
            beatTimeline: computeBeatTimings(lastMeasure, bpmTimeline),
            ...bpmStats,
          };
          tagSoflanTriggers(analyzedChart.arrowTimeline, bpmTimeline);
          const canonicalChart = computeCanonicalChart(simfile.title.titleDir, analyzedChart);
          return {
            meta: {
              difficulty: chartType.difficulty,
              level: chartType.feet,
              arrows: chart.arrows.length,
              stops: chart.stops.length,
              bpmShifts: chart.bpm.length - 1,
              complexity: (
                stats.sixteenths
                + stats.trips
                + 100 * (1 - phraseVariance(analyzedChart.arrowTimeline))
              ),
              canonicalChartErrorRate: canonicalChart.arrowTimeline.filter((a) => (
                a.beat > 24
              )).length / canonicalChart.arrowTimeline.length * 100,
              ...bpmStats,
              ...stats,
            },
            chart: serializedChart(analyzedChart),
            canonicalChart: serializedChart(canonicalChart),
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
      };
      const chartData: ChartData = {
        meta: allMeta,
        chart: chart.chart,
        canonicalChart: chart.canonicalChart,
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
