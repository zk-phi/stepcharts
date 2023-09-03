import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import clsx from "clsx";
import { useTable, useExpanded, usePagination, Cell, Row } from "react-table";
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
        {t.minBpm < t.mainBpm && `(${t.minBpm}-)`}
        {t.mainBpm}
        {t.mainBpm < t.maxBpm && `(-${t.maxBpm})`}
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

type Filter = {
  text: string;
};

const AllSongsTable = React.memo(function AllSongsTable({
  className,
  titles,
  totalTitleCount,
  filter,
  sortedBy,
}: {
  className?: string;
  titles: AllMeta[];
  totalTitleCount: number;
  filter: Filter;
  sortedBy: string;
}) {
  const currentTitles = useMemo(() => {
    let currentTitles = titles;

    if (filter.text.trim()) {
      const compare = filter.text.trim().toLowerCase().split(" ");

      currentTitles = currentTitles.filter((t) => {
        return compare.every((c) => t.filterString.includes(c));
      });
    }

    return currentTitles;
  }, [titles, filter, sortedBy]);

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
      data: currentTitles,
      initialState: {
        pageSize: 200,
        expanded: {},
      },
      getRowId: (row) => row.filterString,
    },
    useExpanded,
    usePagination
  );

  return (
    <div className={className}>
      <div className="my-6 ml-8">
        {currentTitles.length === totalTitleCount ? (
          <span>{currentTitles.length} total songs</span>
        ) : (
          <span>
            <span className="font-bold">{currentTitles.length}</span> song
            {currentTitles.length === 1 ? " " : "s "}
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

const ListConfig = ({ filter, sortedBy, onChangeFilter, onChangeSortedBy }: {
  titles: AllMeta[],
  filter: Filter,
  sortedBy: string,
  onChangeFilter: (f: Filter) => void,
  onChangeSortedBy: (s: string) => void,
}) => {
  const [textFilter, _setTextFilter] = useState(filter.text);

  const updateFilter = useMemo(() => (
    debounce(onChangeFilter, 200)
  ), [onChangeFilter]);

  const setTextFilter = useCallback((newText: string) => {
    _setTextFilter(newText);
    updateFilter({ ...filter, text: newText });
  }, [_setTextFilter, updateFilter, filter]);

  return (
    <ImageFrame className="sm:grid grid-cols-1 sm:grid-cols-3 mt-0 gap-y-4 sm:gap-x-6 w-screen sm:w-auto border-none sm:border-solid sm:border-1 -mx-4 sm:mx-auto sm:mt-8 w-full p-4 bg-focal-300 sm:rounded-tl-xl sm:rounded-br-xl">
      <div className="sm:col-span-1">
        <div className="text-xs ml-2 mb-2">Filter</div>
        <input
            type="text"
            className={styles.input}
            value={textFilter}
            onChange={(e) => setTextFilter(e.target.value)} />
      </div>
      <div className="sm:col-span-1 sm:justify-self-stretch">
        <div className="text-xs ml-2 mb-2">Sort</div>
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
    </ImageFrame>
  );
};

function AllSongsPage({ titles, crumbs }: AllSongsPageProps) {
  const [sortedBy, setSortBy] = useState(SORT_KEYS[0].value);
  const [filter, setFilter] = useState({ text: "" });

  const sortedTitles = useMemo(() => (
    [...titles].sort(getSortFunction(sortedBy))
  ), [titles, sortedBy]);

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
        onChangeFilter={setFilter}
        onChangeSortedBy={setSortBy}
      />
      <AllSongsTable
        className="sm:block"
        titles={sortedTitles}
        totalTitleCount={titles.length}
        filter={filter}
        sortedBy={sortedBy}
      />
    </Root>
  );
}

export { AllSongsPage };
export type { AllSongsPageProps };
