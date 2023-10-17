import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";

import { Root } from "../../layout/Root";

import { Breadcrumbs } from "../../Breadcrumbs";
import ListConfig, { SORT_KEYS, LEVELS, getSortFunction, getSortValueFunction } from "./ListConfig";
import { usePreview } from "../../../lib/hooks/usePreview";
import PreviewSound from "../[mix]/[title]/[type]/PreviewSound";
import { prepareAudioContext } from "../../../lib/audioContext";

import styles from "./index.module.css";

type AllSongsPageProps = {
  titles: AllMeta[];
  crumbs?: { display: string, pathSegment: string }[],
};

const DIFFICULTY_KANJI: Record<Difficulty, string> = {
  beginner: "習",
  basic: "楽",
  difficult: "踊",
  expert: "激",
  challenge: "鬼",
  edit: "？",
};

const AllSongsTable = ({
  titles,
  totalTitleCount,
  getSortValueFunction,
}: {
  titles: AllMeta[],
  totalTitleCount: number,
  getSortValueFunction: (a: AllMeta) => string | null,
}) => {
  const [previewChartId, setPreviewChartId] = useState<[string, string, string]>();
  const [previewChart, setPreviewChart] = useState<ChartData>();
  const [offset, playing, start, stop] = usePreview(previewChart);

  const enableBeatTick = React.useMemo(() => !!previewChart && (
    previewChart.arrowTimeline.reduce((l, r) => l + (r.beat === 4 ? 1 : 0), 0)
    >= previewChart.arrowTimeline.length / 4
  ) , [previewChart]);

  const play = React.useCallback(async ([mix, song, difficulty]) => {
    const response = await fetch(`/stepcharts/_data/${mix}/${song}/${difficulty}.json`);
    await prepareAudioContext();
    setPreviewChartId([mix, song, difficulty]);
    setPreviewChart(await response.json());
  }, [setPreviewChart]);

  useEffect(() => {
    if (previewChart) {
      start();
    }
  }, [previewChart]);

  return (
    <div>
      <table className={styles.newTable}>
        <thead>
          <tr>
            <td>譜面</td>
            <td>楽曲</td>
          </tr>
        </thead>
        <tbody>
          {titles.map((title) => {
            const url = `/${title.mixId}/${title.songId}/${title.difficulty}`;
            const sortValue = getSortValueFunction(title);
            const previewFn = () => play([title.mixId, title.songId, title.difficulty]);
            const chartIsPlayed = playing && previewChartId && (
              previewChartId[0] === title.mixId &&
              previewChartId[1] === title.songId &&
              previewChartId[2] === title.difficulty
            );
            return (
              <tr key={url} className={styles.row}>
                <td>
                  <Link href={url}>
                    <a className={`${styles.difficulty} ${styles[title.difficulty]}`}>
                      {DIFFICULTY_KANJI[title.difficulty]}{title.level}
                    </a>
                  </Link>
                </td>
                <td>
                  {chartIsPlayed ? (
                    <button onClick={stop}>⏹️</button>
                  ) : (
                    <button onClick={previewFn}>▶️</button>
                  )}
                  {" "}
                  <Link href={url}>
                    <a className={styles.title}>{title.title}</a>
                  </Link>
                  { sortValue && (
                    <Link href={url}>
                      <span className={styles.sortValue}>{sortValue}</span>
                    </Link>
                  ) }
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      { previewChart && (
        <PreviewSound
            chart={previewChart}
            offsetRef={offset}
            enableBeatTick={enableBeatTick} />
      ) }
    </div>
  );
};

function AllSongsPage({ titles, crumbs }: AllSongsPageProps) {
  const [sortedBy, setSortBy] = useState(SORT_KEYS[0].value);
  const [filter, setFilter] = useState("");
  const [levelRange, setLevelRange] = useState<[number, number]>(
    [LEVELS[0], LEVELS[LEVELS.length - 1]]
  );
  const [hardestOnly, setHardestOnly] = useState(true);

  const filteredTitles = useMemo(() => {
    const compare = filter.trim().toLowerCase().split(" ");

    let filteredTitles = titles.filter((t) => (
      levelRange[0] <= t.level && t.level <= levelRange[1]
    ));

    if (hardestOnly) {
      filteredTitles = filteredTitles.filter((t) => (
        t.difficulty === "expert" || t.difficulty === "challenge"
      ));
    }

    if (filter.trim()) {
      filteredTitles = filteredTitles.filter((t) => (
        compare.every((c) => t.filterString.includes(c))
      ));
    }

    return filteredTitles;
  }, [titles, filter, levelRange, hardestOnly]);

  const sortedTitles = useMemo(() => (
    [...filteredTitles].sort(getSortFunction(sortedBy))
  ), [filteredTitles, sortedBy]);

  const getSortValue = useMemo(() => (
    getSortValueFunction(sortedBy)
  ), [sortedBy]);

  const titlesCount = (
    <div className={styles.chartCount}>
      {titles.length === sortedTitles.length ? (
        <span>全 {titles.length} 譜面</span>
      ) : (
        <span>
          <b>{sortedTitles.length}</b>
          {" 譜面がマッチ "}
          <small>
            ({titles.length} 譜面中)
          </small>
        </span>
      )}
    </div>
  );

  return (
    <Root
        title="All Songs"
        subheading={crumbs && (
          <Breadcrumbs crumbs={crumbs} />
        )}
        metaDescription={`All ${titles.length} songs available at stepcharts.com`}
    >
      <ListConfig
          filter={filter}
          sortedBy={sortedBy}
          levelRange={levelRange}
          hardestOnly={hardestOnly}
          onChangeFilter={setFilter}
          onChangeLevelRange={setLevelRange}
          onChangeSortedBy={setSortBy}
          onChangeHardestOnly={setHardestOnly}
      />
      {titlesCount}
      <AllSongsTable
          titles={sortedTitles}
          totalTitleCount={titles.length}
          getSortValueFunction={getSortValue}
      />
    </Root>
  );
}

export { AllSongsPage };
export type { AllSongsPageProps };
