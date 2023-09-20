import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";

import { Root } from "../../layout/Root";

import { Breadcrumbs } from "../../Breadcrumbs";
import ListConfig, { SORT_KEYS, LEVELS, getSortFunction, getSortValueFunction } from "./ListConfig";

import styles from "./index.module.css";

type AllSongsPageProps = {
  titles: AllMeta[];
  crumbs?: { display: string, pathSegment: string }[],
};

const DIFFICULTY_KANJI = {
  beginner: "習",
  basic: "楽",
  difficult: "踊",
  expert: "激",
  challenge: "鬼",
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
            return (
              <Link href={url}>
                <tr key={url} className={styles.row}>
                  <td>
                    <a className={`${styles.difficulty} ${styles[title.difficulty]}`}>
                      {DIFFICULTY_KANJI[title.difficulty]}{title.level}
                    </a>
                  </td>
                  <td>
                    <a className={styles.title}>{title.title}</a>
                    { sortValue && <span className={styles.sortValue}>{sortValue}</span> }
                  </td>
                </tr>
              </Link>
            )
          })}
        </tbody>
      </table>
    </div>
  );
};

function AllSongsPage({ titles, crumbs }: AllSongsPageProps) {
  const [sortedBy, setSortBy] = useState(SORT_KEYS[0].value);
  const [filter, setFilter] = useState("");
  const [levelRange, setLevelRange] = useState([LEVELS[0], LEVELS[LEVELS.length - 1]]);
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
    <div className="my-6 ml-8">
      {titles.length === sortedTitles.length ? (
        <span>全 {titles.length} 譜面</span>
      ) : (
        <span>
          <span className="font-bold">{sortedTitles.length}</span>
          {" 譜面がマッチ "}
          <span className="text-focal-400">
            ({titles.length} 譜面中)
          </span>
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
