import React from "react";
import { Root } from "../../../layout/Root";
import { StepchartTypePageItem } from "../../../StepchartTypePageItem";
import { ImageFrame } from "../../../ImageFrame";
import { TitleDetailsRow, TitleDetailsTable } from "../../../TitleDetailsTable";

import { Breadcrumbs } from "../../../Breadcrumbs";
import { Banner } from "../../../Banner";

type TitlePageProps = {
  song: SongMeta & { charts: ChartMeta[] },
  mix: MixMeta,
};

function buildTypeUrl(mixId: string, songId: string, difficulty: string): string {
  return `/${mixId}/${songId}/${difficulty}`;
}

function TitlePage({ song, mix }: TitlePageProps) {
  const title = song.titleTranslit || song.title;

  const breadcrumbs = (
    <Breadcrumbs
      crumbs={[
        { display: mix.name, pathSegment: mix.mixId },
        { display: title, pathSegment: song.songId },
      ]}
    />
  );

  return (
    <Root
      title={title}
      subheading={breadcrumbs}
      metaDescription={`Step charts for ${title}`}
    >
      <div className="w-screen -mx-4 bg-focal-300 sticky top-0 z-10 shadow-lg sm:hidden">
        <Banner
          className="mx-auto border-b-4 border-white w-full absolute top-0 left-0"
          song={song}
        />
      </div>
      <ImageFrame className="mt-0 w-screen sm:w-auto border-none sm:border-solid sm:border-1 -mx-4 sm:mx-auto sm:mt-8 mb-8 sm:sticky sm:top-0 sm:z-10 p-4 bg-focal-300 sm:rounded-tl-xl sm:rounded-br-xl flex flex-col sm:flex-row items-center justify-center sm:justify-start sm:space-x-4">
        <div className="hidden sm:block w-full sm:w-64">
          <Banner
            className="mx-auto border-2 border-white w-full absolute top-0 left-0"
            song={song}
          />
        </div>
        <TitleDetailsTable>
          {song.titleTranslit && (
            <TitleDetailsRow name="Native title" value={song.title} />
          ) || null}
          <TitleDetailsRow name="BPM" value={song.displayBpm} />
          <TitleDetailsRow name="Artist" value={song.artist ?? "unknown"} />
          <TitleDetailsRow name="Mix" value={mix.name} />
        </TitleDetailsTable>
      </ImageFrame>
      <ul className="flex flex-row flex-wrap justify-center sm:justify-around items-start">
        <li className="mb-8 sm:mb-0">
          <ul className="shadow-md">
            {song.charts.map((chart, index) => {
              return (
                <li key={chart.difficulty}>
                  <a href={buildTypeUrl(mix.mixId, song.songId, chart.difficulty)}>
                    <StepchartTypePageItem
                        chart={chart}
                        isLast={index === song.charts.length - 1}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </li>
      </ul>
    </Root>
  );
}

export { TitlePage };
export type { TitlePageProps };
