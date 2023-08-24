import React, { useState, useMemo } from "react";
import { Root } from "../../layout/Root";
import { ImageFrame } from "../../ImageFrame";
import { Breadcrumbs } from "../../Breadcrumbs";
import { CompactTitleCard } from "../../CompactTitleCard";
import { SortBar } from "../../SortBar";
import type { MixData } from "../../../scripts/genAllStepchartData";

type SongData = SongMeta & { charts: ChartMeta[] };

type MixPageProps = {
  mix: MixData;
};

function getMaxBpm(displayBpm: string): number {
  if (!isNaN(Number(displayBpm))) {
    return Number(displayBpm);
  }

  const range = displayBpm.split("-").map(Number);

  return Math.max(...range);
}

const SORT_KEYS = [
  "title",
  "bpm",
];

function getSortFunction(key: string) {
  switch (key) {
    case "title":
      return (a: SongData, b: SongData) => {
        return (a.titleTranslit || a.title)
          .toLowerCase()
          .localeCompare(
            (b.titleTranslit || b.title).toLowerCase()
          );
      };
    case "bpm":
      return (a: SongData, b: SongData) => {
        return b.maxBpm - a.maxBpm;
      };
    default:
      return (a: SongData, b: SongData) => 0;
  }
}

function MixPage({ mix }: MixPageProps) {
  const [sortedBy, setSortBy] = useState(SORT_KEYS[0]);
  const sortedTitles = useMemo(() => (
    [...mix.songs].sort(getSortFunction(sortedBy))
  ), [mix, sortedBy]);

  return (
    <Root
      title={mix.name}
      subheading={
        <Breadcrumbs
          crumbs={[{ display: mix.name, pathSegment: mix.mixId }]}
        />
      }
      metaDescription={`Step charts for DDR ${mix.name}`}
    >
      <div className="w-screen -mx-4 bg-focal-300 sticky top-0 z-10 shadow-lg sm:hidden">
        <div
          className="border-b-4 border-white w-full bg-no-repeat bg-cover mx-auto"
          style={{
            paddingTop: "calc(80 / 256 * 100%)",
            backgroundImage: `url(${mix.bannerSrc})`,
          }}
          role="image"
          aria-label={`${mix.name} banner`}
        />
      </div>
      <ImageFrame className="mt-0 w-screen sm:w-auto border-none sm:border-solid sm:border-1 -mx-4 sm:mx-auto sm:mt-8 mb-8 sm:sticky sm:top-0 sm:z-10 w-full p-4 bg-focal-300 sm:rounded-tl-xl sm:rounded-br-xl flex flex-col sm:flex-row items-center sm:justify-start sm:space-x-4">
        <div className="hidden sm:block w-full sm:w-64">
          <div
            className="border-2 border-white w-full bg-no-repeat bg-cover"
            style={{
              paddingTop: "calc(80 / 256 * 100%)",
              backgroundImage: `url(${mix.bannerSrc})`,
            }}
            role="image"
            aria-label={`${mix.name} banner`}
          />
        </div>
        <div className="sm:flex sm:flex-col mt-2 sm:mt-0 sm:flex-1 w-full max-w-xl justify-center">
          <div className="hidden sm:block text-xs mb-1">sort by</div>
          <SortBar sorts={SORT_KEYS} sortedBy={sortedBy} onSortChange={setSortBy} />
        </div>
      </ImageFrame>
      <div
        className="grid mt-8 items-start"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(275px, 1fr))",
          columnGap: "2rem",
          rowGap: "2rem",
        }}
      >
        {sortedTitles.map((song) => (
          <CompactTitleCard key={song.songId} song={song} mix={mix} hideMix />
        ))}
      </div>
    </Root>
  );
}

export { MixPage };
export type { MixPageProps };
