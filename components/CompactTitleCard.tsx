import React from "react";
import clsx from "clsx";
import { GiStopSign } from "react-icons/gi";

import { ImageFrame } from "./ImageFrame";
import { shortMixNames } from "../lib/meta";

import styles from "./CompactTitleCard.module.css";
import { Banner } from "./Banner";

type CompactTitleCardProps = {
  className?: string;
  song: SongMeta & { charts: ChartMeta[] },
  mix: MixMeta;
  hideMix?: boolean;
};

function buildTitleUrl(
  mix: MixMeta,
  song: SongMeta,
): string {
  return `/${mix.id}/${song.id}`;
}

function buildStepchartUrl(
  mix: MixMeta,
  song: SongMeta,
  chart: ChartMeta,
): string {
  return `/${mix.id}/${song.id}/${chart.difficulty}`;
}

const Types = ({
  mix,
  song,
}: {
  mix: MixMeta;
  song: SongMeta & { charts: ChartMeta[] };
}) => (
  <div
      className={clsx(
        "w-full flex flex-row justify-around text-white font-bold items-center"
      )}
  >
    {song.charts.map((chart) => (
      <a
          href={buildStepchartUrl(mix, song, chart)}
          key={chart.difficulty}
          className={clsx(
            styles[chart.difficulty],
            "block hover:bg-gray-600 transform hover:scale-150 w-6 h-6 text-center"
          )}
      >
        {chart.level}
      </a>
    ))}
  </div>
);

function CompactTitleCard({
  className,
  mix,
  song,
  hideMix,
}: CompactTitleCardProps) {
  return (
    <ImageFrame
      className={clsx(
        className,
        clsx(
          "flex flex-col bg-gray-900 overflow-hidden rounded-tl-2xl rounded-br-2xl"
        )
      )}
    >
      <div
        className={clsx("grid bg-gray-600 items-center xpy-1 pl-3 xpr-1", {
          "pr-3": !!hideMix,
        })}
        style={{ gridTemplateColumns: "1fr max-content" }}
      >
        <div>
          <a
            href={buildTitleUrl(mix, song)}
            className="inline-block font-bold text-white px-1"
          >
            {song.titleTranslit || song.title}
          </a>
        </div>
        {!hideMix && (
          <div
            className="ml-2 px-2 py-0.5 bg-gray-400 text-xs text-gray-800 grid place-items-center rounded-bl-lg mb-2"
            style={{ alignSelf: "start" }}
          >
            <a href={`/${mix.id}`}>{mix.shortName}</a>
          </div>
        )}
      </div>

      <div className="pb-2 xpx-3">
        <a href={buildTitleUrl(mix, song)}>
          <Banner
            className="w-full h-full border-b border-t border-white"
            song={song}
          />
        </a>
      </div>

      <div className="flex flex-row justify-items-stretch xmx-2 xmy-2 p-2 pt-0">
        <Types mix={mix} song={song} />
      </div>
    </ImageFrame>
  );
}

export { CompactTitleCard };
