import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import clsx from "clsx";
import { useTable, usePagination, Cell, Row } from "react-table";

import { Root } from "../../layout/Root";

import { Breadcrumbs } from "../../Breadcrumbs";
import { PageBar } from "./PageBar";
import ListConfig, { SORT_KEYS, LEVELS, getSortFunction, getSortValueFunction } from "./ListConfig";

import styles from "./index.module.css";
import difficultyBgStyles from "../../difficultyBackgroundColors.module.css";
import { ImageFrame } from "../../ImageFrame";

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

function AllSongsPageCell({
  row,
  cell,
  sortValue,
}: {
  row: Row<AllMeta>;
  cell: Cell<AllMeta>;
  sortValue: string | null;
}) {
  if (cell.column.id === "Title" && sortValue) {
    const chart = row.original;
    return (
      <td {...cell.getCellProps()}>
        <div className={styles.titleCell}>
          <div>{cell.render("Cell")}</div>
          <Link href={`/${chart.mixId}/${chart.songId}/${chart.difficulty}`}>
            <a className={styles.stat}>
              {sortValue}
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
  getSortValueFunction,
}: {
  titles: AllMeta[];
  totalTitleCount: number;
  getSortValueFunction: (a: AllMeta) => string | null;
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
          <span>全 {titles.length} 譜面</span>
        ) : (
          <span>
            <span className="font-bold">{titles.length}</span>
            {" 譜面がマッチ "}
            <span className="text-focal-400">
              ({totalTitleCount} 譜面中)
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
                        sortValue={getSortValueFunction(row.original)}
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
        getSortValueFunction={getSortValue}
      />
    </Root>
  );
}

export { AllSongsPage };
export type { AllSongsPageProps };
