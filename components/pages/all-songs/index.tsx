import React, { useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { useTable, useExpanded, usePagination, Cell, Row } from "react-table";
import Slider from "@material-ui/core/Slider";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { IoIosPhoneLandscape } from "react-icons/io";
import debounce from "lodash.debounce";

import { Root } from "../../layout/Root";

import { FilterInput } from "../../FilterInput";
import { useSort } from "../../SortHook";
import { SortBar } from "../../SortBar";
import { PageBar } from "./PageBar";

import styles from "./index.module.css";
import difficultyBgStyles from "../../difficultyBackgroundColors.module.css";
import { ImageFrame } from "../../ImageFrame";
import { StepchartTypePageItem } from "../../StepchartTypePageItem";

const STAT_KEYS = ["jumps", "jacks", "freezes", "gallops"];

type AllSongsPageProps = {
  titles: AllChartsData;
};

type ChartData = typeof AllChartsData[number];

function RotateYourPhone() {
  return (
    <div className="sm:hidden flex flex-col items-center mt-16">
      <IoIosPhoneLandscape className="text-9xl w-full" />
      <h1 className="text-lg font-bold mb-4">Please rotate your phone</h1>
      <p>This page just barely fits in landscape mode</p>
    </div>
  );
}

function buildStepchartUrl(t: ChartData): string {
  return `/${t.mix.id}/${t.song.id}/${t.chart.difficulty}`;
}

function buildTitleUrl(t: ChartData): string {
  return `/${t.mix.id}/${t.song.id}`;
}

function buildMixUrl(t: ChartData): string {
  return `/${t.mix.id}`;
}

const columns = [
  {
    Header: "Title",
    accessor: (t: ChartData) => (
      <a className="hover:underline" href={buildTitleUrl(t)}>
        {t.song.titleTranslit || t.song.title}
        {" "}
        ({ t.chart.difficulty.substring(0, 1).toUpperCase() }SP)
      </a>
    ),
  },
  {
    Header: "Mix",
    accessor: (t: ChartData) => (
      <a className="hover:underline" href={buildMixUrl(t)}>
        {t.mix.shortName}
      </a>
    ),
  },
  {
    Header: "Artist",
    accessor: (t: ChartData) => t.song.artist,
  },
  {
    Header: "bpm",
    accessor: (t: ChartData) => t.song.displayBpm,
  },
  {
    Header: "tempo shifts",
    accessor: (t: ChartData) => t.chart.bpmShifts || "-",
  },
  {
    Header: "stops",
    accessor: (t: ChartData) => t.chart.stops || "-",
  },
];

function getMaxBpmForAllTitles(charts: ChartData[]): number {
  const bpms = charts.map((t) => t.song.maxBpm);
  return Math.round(Math.max(...bpms));
}

function getSortFunction(key: string) {
  switch (key) {
    case "title":
      return (a: ChartData, b: ChartData) => {
        return (a.song.titleTranslit || a.song.title)
          .toLowerCase()
          .localeCompare(
            (b.song.titleTranslit || b.song.title).toLowerCase()
          );
      };
    case "bpm":
      return (a: ChartData, b: ChartData) => {
        return b.song.maxBpm - a.song.maxBpm;
      };
    case "t.shifts":
      return (a: ChartData, b: ChartData) => {
        return b.chart.bpmShifts - a.chart.bpmShifts;
      };
    case "stops":
      return (a: ChartData, b: ChartData) => {
        return b.chart.stops - a.chart.stops;
      };

    default:
      return (a: ChartData, b: ChartData) => {
        const aStats = a.chart[key as keyof Stats];
        const bStats = b.chart[key as keyof Stats];

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
  title: ChartData;
  stat: keyof Stats;
}) {
  return (
    <a
      className={clsx(className, difficultyBgStyles[title.chart.difficulty])}
      href={buildStepchartUrl(title, title.chart.difficulty)}
    >
      {title.chart[stat]} {depluralize(stat, title.chart[stat])}
    </a>
  );
}

function AllSongsPageCell({
  row,
  cell,
  sortedBy,
}: {
  row: Row<ChartData>;
  cell: Cell<ChartData>;
  sortedBy: string;
}) {
  if (cell.column.id === "Title" && isSortingOnStats(sortedBy)) {
    return (
      <td {...cell.getCellProps()}>
        <div className="flex flex-row items-center justify-between pr-2">
          <div>{cell.render("Cell")}</div>
          <StatLink
            className="whitespace-nowrap px-1 py-0.5 text-xs text-white"
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
  titles: ChartData[];
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
        if (t.song.minBpm === t.song.maxBpm) {
          return filter.bpm[0] <= t.song.minBpm && filter.bpm[1] >= t.song.minBpm;
        } else {
          return (
            (filter.bpm[0] <= t.song.minBpm && filter.bpm[1] >= t.song.minBpm) ||
            (filter.bpm[0] <= t.song.maxBpm && filter.bpm[1] >= t.song.maxBpm)
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
              <tr key={rowProps.key} {...row.getRowProps()}>
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

function AllSongsPage({ titles }: AllSongsPageProps) {
  const maxBpm = getMaxBpmForAllTitles(titles);
  const [textFilter, _setTextFilter] = useState("");
  const [curBpmRange, _setCurBpmRange] = useState<[number, number]>([
    0,
    maxBpm,
  ]);
  const { sortedBy, setSortBy, sorts, sortedTitles } = useSort(
    titles,
    getSortFunction
  );

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
          <SortBar sorts={sorts} sortedBy={sortedBy} onSortChange={setSortBy} />
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
