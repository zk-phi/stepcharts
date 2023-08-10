import React from "react";
import { Root } from "../../../layout/Root";
import { StepchartTypePageItem } from "../../../StepchartTypePageItem";
import { ImageFrame } from "../../../ImageFrame";
import { TitleDetailsRow, TitleDetailsTable } from "../../../TitleDetailsTable";

import { Breadcrumbs } from "../../../Breadcrumbs";
import { Banner } from "../../../Banner";

type TitlePageMix = {
  mixName: string;
  mixDir: string;
};

type TitlePageProps = {
  title: Title;
  displayBpm: string;
  artist: string | null;
  mix: TitlePageMix;
  types: StepchartType[];
};

function buildTypeUrl(mixDir: string, titleDir: string, slug: string): string {
  return `/${mixDir}/${titleDir}/${slug}`;
}

function TitlePage({ title, displayBpm, artist, mix, types }: TitlePageProps) {
  const name = title.translitTitleName || title.titleName;
  if (types.length === 0) {
    throw new Error(`TitlePage: empty title! ${name}, ${mix.mixName}`);
  }

  const breadcrumbs = (
    <Breadcrumbs
      crumbs={[
        { display: mix.mixName, pathSegment: mix.mixDir },
        { display: name, pathSegment: title.titleDir },
      ]}
    />
  );

  return (
    <Root
      title={name}
      subheading={breadcrumbs}
      metaDescription={`Step charts for ${name}`}
    >
      <div className="w-screen -mx-4 bg-focal-300 sticky top-0 z-10 shadow-lg sm:hidden">
        <Banner
          className="mx-auto border-b-4 border-white w-full absolute top-0 left-0"
          title={title}
        />
      </div>
      <ImageFrame className="mt-0 w-screen sm:w-auto border-none sm:border-solid sm:border-1 -mx-4 sm:mx-auto sm:mt-8 mb-8 sm:sticky sm:top-0 sm:z-10 p-4 bg-focal-300 sm:rounded-tl-xl sm:rounded-br-xl flex flex-col sm:flex-row items-center justify-center sm:justify-start sm:space-x-4">
        <div className="hidden sm:block w-full sm:w-64">
          <Banner
            className="mx-auto border-2 border-white w-full absolute top-0 left-0"
            title={title}
          />
        </div>
        <TitleDetailsTable>
          {title.translitTitleName && (
            <TitleDetailsRow name="Native title" value={title.titleName} />
          ) || null}
          <TitleDetailsRow name="BPM" value={displayBpm} />
          <TitleDetailsRow name="Artist" value={artist ?? "unknown"} />
          <TitleDetailsRow name="Mix" value={mix.mixName} />
        </TitleDetailsTable>
      </ImageFrame>
      <ul className="flex flex-row flex-wrap justify-center sm:justify-around items-start">
        <li className="mb-8 sm:mb-0">
          <ul className="shadow-md">
            {types.map((type, index) => {
              return (
                <li key={type.difficulty}>
                  <a href={buildTypeUrl(mix.mixDir, title.titleDir, type.slug)}>
                    <StepchartTypePageItem
                        type={type}
                        isLast={index === types.length - 1}
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
