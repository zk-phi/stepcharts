import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import clsx from "clsx";
import { useTable, usePagination, Cell, Row } from "react-table";
import debounce from "lodash.debounce";

import { Root } from "../../layout/Root";

import { Breadcrumbs } from "../../Breadcrumbs";
import { PageBar } from "./PageBar";

import styles from "./index.module.css";
import difficultyBgStyles from "../../difficultyBackgroundColors.module.css";
import { ImageFrame } from "../../ImageFrame";

const STAT_KEYS = [
  "arrows",
  "stops",
  "jumps",
  "jacks",
  "freezes",
  "gallops",
  "bpmShifts",
  "shocks",
];

const SORT_KEYS = [
  { value: "title", label: "曲名" },
  { value: "level", label: "難易度値" },
  { value: "minBpm", label: "最小BPM" },
  { value: "maxBpm", label: "最大BPM" },
  { value: "arrows", label: "ステップ数" },
  { value: "jumps", label: "ジャンプ" },
  { value: "jacks", label: "縦連" },
  { value: "freezes", label: "フリーズ" },
  { value: "gallops", label: "スキップ" },
  { value: "stops", label: "停止回数" },
  { value: "bpmShifts", label: "変速回数" },
  { value: "shocks", label: "ショック" },
];

const LEVELS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
];

type AllSongsPageProps = {
  titles: AllMeta[];
  crumbs?: { display: string, pathSegment: string }[],
};

const columns = [
  {
    Header: "Level",
    accessor: (t: AllMeta) => (
      <Link href={`/${t.mixId}/${t.songId}/${t.difficulty}`}>
        <a className={clsx(styles.level, difficultyBgStyles[t.difficulty])}>
          {t.difficulty.substring(0, 3).toUpperCase()} {t.level}
        </a>
      </Link>
    ),
  },
  {
    Header: "Title",
    accessor: (t: AllMeta) => (
      <Link href={`/${t.mixId}/${t.songId}/${t.difficulty}`}>
        <a className={styles.link}>
          {t.title}
        </a>
      </Link>
    ),
  },
  {
    Header: "bpm",
    accessor: (t: AllMeta) => (
      <>
        {t.minBpm < t.mainBpm && `(${t.minBpm})-`}
        {t.mainBpm}
        {t.mainBpm < t.maxBpm && `-(${t.maxBpm})`}
      </>
    ),
  },
];

function getSortFunction(key: string) {
  switch (key) {
    case "title":
      return (a: AllMeta, b: AllMeta) => {
        return (a.titleTranslit || a.title)
          .toLowerCase()
          .localeCompare(
            (b.titleTranslit || b.title).toLowerCase()
          );
      };
    case "minBpm":
      return (a: AllMeta, b: AllMeta) => {
        return a.minBpm - b.minBpm;
      };
    default:
      return (a: AllMeta, b: AllMeta) => {
        const aStats = a[key as keyof Stats];
        const bStats = b[key as keyof Stats];

        return bStats - aStats;
      };
  }
}

function isSortingOnStats(sortKey: string): boolean {
  return STAT_KEYS.findIndex((k) => k === sortKey) !== -1;
}

function depluralize(s: string, count: number): string {
  if (count === 1) {
    return s.substring(0, s.length - 1);
  }

  return s;
}

function AllSongsPageCell({
  row,
  cell,
  sortedBy,
}: {
  row: Row<AllMeta>;
  cell: Cell<AllMeta>;
  sortedBy: string;
}) {
  if (cell.column.id === "Title" && isSortingOnStats(sortedBy)) {
    const chart = row.original;
    const value = chart[sortedBy as keyof Stats];
    return (
      <td {...cell.getCellProps()}>
        <div className={styles.titleCell}>
          <div>{cell.render("Cell")}</div>
          <Link href={`/${chart.mixId}/${chart.songId}/${chart.difficulty}`}>
            <a className={styles.stat}>
              {value} {depluralize(sortedBy, value)}
            </a>
          </Link>
        </div>
      </td>
    );
  }

  return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
}

const AllSongsTable = React.memo(function AllSongsTable({
  titles,
  totalTitleCount,
  sortedBy,
}: {
  titles: AllMeta[];
  totalTitleCount: number;
  sortedBy: string,
}) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    pageCount,
    gotoPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data: titles,
      initialState: {
        pageSize: 200,
      },
      getRowId: (row) => row.filterString,
    },
    usePagination
  );

  return (
    <div className="sm:block">
      <div className="my-6 ml-8">
        {titles.length === totalTitleCount ? (
          <span>{titles.length} total songs</span>
        ) : (
          <span>
            <span className="font-bold">{titles.length}</span> song
            {titles.length === 1 ? " " : "s "}
            matching{" "}
            <span className="text-focal-400">
              (out of {totalTitleCount} total)
            </span>
          </span>
        )}
      </div>
      <table
        {...getTableProps()}
        className={clsx(styles.table, "table-fixed")}
        cellPadding={0}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} className={column.id}>
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            const rowProps = row.getRowProps();

            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <AllSongsPageCell
                        key={cell.getCellProps().key}
                        row={row}
                        cell={cell}
                        sortedBy={sortedBy}
                    />
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {pageCount > 1 && (
        <div className="mt-8 flex flex-row items-center justify-center space-x-2">
          <div className="text-sm">pages</div>
          <PageBar
            className="max-w-lg"
            pageCount={pageCount}
            currentPageIndex={pageIndex}
            onGotoPage={gotoPage}
          />
        </div>
      )}
    </div>
  );
});

const ListConfig = ({
  filter,
  sortedBy,
  levelRange,
  hardestOnly,
  onChangeFilter,
  onChangeLevelRange,
  onChangeSortedBy,
  onChangeHardestOnly,
}: {
  filter: string,
  sortedBy: string,
  levelRange: [number, number],
  onChangeFilter: (f: Filter) => void,
  onChangeLevelRange: (r: [number, number]) => void,
  onChangeSortedBy: (s: string) => void,
}) => {
  const [textFilter, _setTextFilter] = useState(filter.text);

  const updateFilter = useMemo(() => (
    debounce(onChangeFilter, 200)
  ), [onChangeFilter]);

  const setTextFilter = useCallback((newText: string) => {
    _setTextFilter(newText);
    updateFilter(newText);
  }, [_setTextFilter, updateFilter]);

  return (
    <div className={styles.filterContainer}>
      <div>
        絞り込み：
        <input
            type="text"
            className={styles.input}
            value={textFilter}
            onChange={(e) => setTextFilter(e.target.value)} />
      </div>
      <div>
        並べ替え：
        <select
            className={styles.input}
            value={sortedBy}
            onChange={(e) => onChangeSortedBy(e.target.value)}>
          {SORT_KEYS.map((k) => (
            <option key={k.value} value={k.value}>
              {k.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        レベル：
        <select
            className={styles.input}
            value={levelRange[0]}
            onChange={(e) => onChangeLevelRange([Number(e.target.value), levelRange[1]])}>
          {LEVELS.map((v) => (
            v <= levelRange[1] && (<option key={v} value={v}>{v}</option>)
          ))}
        </select>
        {" 〜 "}
        <select
            className={styles.input}
            value={levelRange[1]}
            onChange={(e) => onChangeLevelRange([levelRange[0], Number(e.target.value)])}>
          {LEVELS.map((v) => (
            levelRange[0] <= v && (<option key={v} value={v}>{v}</option>)
          ))}
        </select>
      </div>
      <div>
        激鬼のみ：
        <input
            type="checkbox"
            checked={hardestOnly}
            onChange={(e) => onChangeHardestOnly(!!e.target.checked)} />
      </div>
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
      <AllSongsTable
        titles={sortedTitles}
        totalTitleCount={titles.length}
        sortedBy={sortedBy}
      />
    </Root>
  );
}

export { AllSongsPage };
export type { AllSongsPageProps };
