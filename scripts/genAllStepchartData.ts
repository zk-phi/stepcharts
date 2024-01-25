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

const phraseVariance = (timings: number[]): number => {
  const table: Record<string, number> = {};
  timings.forEach((_, ix) => {
    if (ix >= 2) {
      const offset1 = Math.round(1000 * (timings[ix] - timings[ix - 1]));
      const offset2 = Math.round(1000 * (timings[ix - 1] - timings[ix - 2]));
      const key = `${offset1}/${offset2}`;
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

type Converter = (input: number) => number;

const makeOffsetToSecConverter = (bpmTimeline: BpmEvent[]): Converter => {
  let ix = 0;
  let lastOffset = 0;
  const offsetToSec = (offset: number): number => {
    if (offset < lastOffset) {
      ix = 0;
    }
    while (bpmTimeline[ix + 1] && bpmTimeline[ix + 1].offset < offset) {
      ix++;
    }
    return bpmTimeline[ix].time + (
      (offset - bpmTimeline[ix].offset) * 4 / bpmTimeline[ix].bpm * 60
    );
  };
  return offsetToSec;
}

const computeArrowTimings = (arrows: Arrow[], bpmTimeline: BpmEvent[]): number[] => {
  const converter = makeOffsetToSecConverter(bpmTimeline);
  return arrows.map((arrow) => converter(arrow.offset));
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
      chart: AnalyzedStepchart,
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
          const bpmTimeline = extractTimelineEvents(chart);
          const arrowTimings = computeArrowTimings(chart.arrows, bpmTimeline);
          const stats = simfile.stats[chartType.difficulty];
          return {
            meta: {
              difficulty: chartType.difficulty,
              level: chartType.feet,
              arrows: chart.arrows.length,
              stops: chart.stops.length,
              bpmShifts: chart.bpm.length - 1,
              minBpm: simfile.minBpm,
              maxBpm: simfile.maxBpm,
              mainBpm: Math.round(findMainBpm(chart, bpmTimeline)),
              complexity: stats.sixteenths + stats.trips + 100 * (1 - phraseVariance(arrowTimings)),
              ...stats,
            },
            chart: {
              // I dont know why but all freezes in RawSimfile
              // are longer by 1 beat, so we substract 1 beat here
              // to make them correct through the rest of this app.
              freezes: chart.freezes.map((freeze) => ({
                ...freeze,
                endOffset: freeze.endOffset - 0.25,
              })),
              bpmTimeline,
              arrowTimeline: chart.arrows.map((arrow, ix) => ({
                ...arrow,
                time: arrowTimings[ix],
              })),
            },
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
