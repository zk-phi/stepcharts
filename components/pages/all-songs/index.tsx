import React, { useMemo, useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { useTable, useExpanded, usePagination, Cell, Row } from "react-table";
import Slider from "@material-ui/core/Slider";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { IoIosPhoneLandscape } from "react-icons/io";
import debounce from "lodash.debounce";

import { Root } from "../../layout/Root";

import { Breadcrumbs } from "../../Breadcrumbs";
import { FilterInput } from "../../FilterInput";
import { SortBar } from "../../SortBar";
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
  "title",
  "level",
  "minBpm",
  "maxBpm",
  "arrows",
  "jumps",
  "jacks",
  "freezes",
  "gallops",
  "stops",
  "bpmShifts",
  "shocks",
];

type AllSongsPageProps = {
  titles: AllMeta[];
  crumbs?: { display: string, pathSegment: string }[],
};

function RotateYourPhone() {
  return (
    <div className="sm:hidden flex flex-col items-center mt-16">
      <IoIosPhoneLandscape className="text-9xl w-full" />
      <h1 className="text-lg font-bold mb-4">Please rotate your phone</h1>
      <p>This page just barely fits in landscape mode</p>
    </div>
  );
}

const columns = [
  {
    Header: "Level",
    accessor: (t: AllMeta) => (
      <Link href={`/${t.mixId}/${t.songId}/${t.difficulty}`}>
        <a className={clsx("px-1 py-0.5 text-sm text-white", difficultyBgStyles[t.difficulty])}>
          {t.difficulty.substring(0, 3).toUpperCase()} {t.level}
        </a>
      </Link>
    ),
  },
  {
    Header: "Title",
    accessor: (t: AllMeta) => (
      <Link href={`/${t.mixId}/${t.songId}/${t.difficulty}`}>
        <a className="hover:underline">
          {t.title}
        </a>
      </Link>
    ),
  },
  {
    Header: "Mix",
    accessor: (t: AllMeta) => (
      <Link href={`/${t.mixId}`}>
        <a className="hover:underline">
          {t.shortName}
        </a>
      </Link>
    ),
  },
  {
    Header: "Artist",
    accessor: (t: AllMeta) => t.artist,
  },
  {
    Header: "bpm",
    accessor: (t: AllMeta) => t.displayBpm,
  },
];

function getMaxBpmForAllTitles(charts: AllMeta[]): number {
  const bpms = charts.map((t) => t.maxBpm);
  return Math.round(Math.max(...bpms));
}

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

function StatLink({
  className,
  title,
  stat,
}: {
  className?: string;
  title: AllMeta;
  stat: keyof Stats;
}) {
  return (
    <Link href={`/${title.mixId}/${title.songId}/${title.difficulty}`}>
      <a className={className}>
        {title[stat]} {depluralize(stat, title[stat])}
      </a>
    </Link>
  );
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
    return (
      <td {...cell.getCellProps()}>
        <div className="flex flex-row items-center justify-between pr-2">
          <div>{cell.render("Cell")}</div>
          <StatLink
            className="whitespace-nowrap px-1 py-0.5 text-xs border rounded-md border-gray-400"
            title={row.original}
            stat={sortedBy as keyof Stats}
          />
        </div>
      </td>
    );
  }

  return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
}

function ThumbComponent(props: any) {
  return (
    <div
      {...props}
      className="absolute top-0 w-8 h-8 inline-block outline-none bg-focal-50 text-focal-500 text-xs grid place-items-center"
    >
      {props["aria-valuenow"]}
    </div>
  );
}

type Filter = {
  bpm: [number, number];
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
  const maxBpm = useRef(filter.bpm[1]);

  const currentTitles = useMemo(() => {
    let currentTitles = titles;

    if (filter.text.trim()) {
      const compare = filter.text.trim().toLowerCase();

      currentTitles = currentTitles.filter((t) => {
        return t.filterString.includes(compare);
      });
    }

    if (filter.bpm[0] > 0 || filter.bpm[1] < maxBpm.current) {
      currentTitles = currentTitles.filter((t) => {
        if (t.minBpm === t.maxBpm) {
          return filter.bpm[0] <= t.minBpm && filter.bpm[1] >= t.minBpm;
        } else {
          return (
            (filter.bpm[0] <= t.minBpm && filter.bpm[1] >= t.minBpm) ||
            (filter.bpm[0] <= t.maxBpm && filter.bpm[1] >= t.maxBpm)
          );
        }
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

function AllSongsPage({ titles, crumbs }: AllSongsPageProps) {
  const maxBpm = getMaxBpmForAllTitles(titles);
  const [textFilter, _setTextFilter] = useState("");
  const [curBpmRange, _setCurBpmRange] = useState<[number, number]>([
    0,
    maxBpm,
  ]);
  const [sortedBy, setSortBy] = useState(SORT_KEYS[0]);
  const sortedTitles = useMemo(() => (
    [...titles].sort(getSortFunction(sortedBy))
  ), [titles, sortedBy]);

  const [currentFilter, setCurrentFilter] = useState<Filter>({
    bpm: curBpmRange,
    text: textFilter,
  });

  const debouncedSetCurrentFilter = useMemo(() => {
    return debounce(setCurrentFilter, 200);
  }, [setCurrentFilter]);

  function setCurBpmRange(newRange: [number, number]) {
    _setCurBpmRange(newRange);
    debouncedSetCurrentFilter((f) => {
      return {
        ...f,
        bpm: newRange,
      };
    });
  }

  function setTextFilter(newText: string) {
    _setTextFilter(newText);
    debouncedSetCurrentFilter((f) => {
      return {
        ...f,
        text: newText,
      };
    });
  }

  return (
    <Root
      title="All Songs"
      subheading={crumbs && (
        <Breadcrumbs crumbs={crumbs} />
      )}
      metaDescription={`All ${titles.length} songs available at stepcharts.com`}
    >
      <RotateYourPhone />
      <ImageFrame className="hidden sm:grid grid-cols-1 sm:grid-cols-3 mt-0 gap-y-4 sm:gap-x-6 w-screen sm:w-auto border-none sm:border-solid sm:border-1 -mx-4 sm:mx-auto sm:mt-8 w-full p-4 bg-focal-300 sm:rounded-tl-xl sm:rounded-br-xl">
        <div className="sm:col-span-1">
          <div className="text-xs ml-2">Filter</div>
          <FilterInput
            value={textFilter}
            onChange={(newValue) => setTextFilter(newValue)}
          />
        </div>
        <div className="sm:col-span-1 sm:justify-self-stretch">
          <div className="text-xs ml-2">Sort</div>
          <SortBar sorts={SORT_KEYS} sortedBy={sortedBy} onSortChange={setSortBy} />
        </div>
        <div className="sm:col-span-1">
          <div className="text-xs ml-2">BPM</div>
          <div className={styles.sliderContainer}>
            <Slider
              classes={{
                root: styles.sliderRoot,
                rail: styles.sliderRail,
                track: styles.sliderTrack,
              }}
              value={curBpmRange}
              max={maxBpm}
              min={0}
              step={10}
              onChange={(_e, r) => setCurBpmRange(r as [number, number])}
              valueLabelDisplay="off"
              ThumbComponent={ThumbComponent}
              aria-labelledby="range-slider"
              getAriaValueText={(v) => `${v}bpm`}
            />
          </div>
        </div>
      </ImageFrame>
      <AllSongsTable
        className="hidden sm:block"
        titles={sortedTitles}
        totalTitleCount={titles.length}
        filter={currentFilter}
        sortedBy={sortedBy}
      />
    </Root>
  );
}

export { AllSongsPage };
export type { AllSongsPageProps };
