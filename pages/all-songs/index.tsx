import React from "react";
import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import allData from "../../lib/allStepchartData";
import { AllSongsPage } from "../../components/pages/all-songs";
import type { AllSongsPageProps } from "../../components/pages/all-songs";

function getTempShiftCount(sf: Simfile): number {
  const chart = Object.values(sf.charts)[0];

  return chart.bpm.length - 1;
}

function getFilterString(sf: Simfile): string {
  const { translitTitleName, titleName } = sf.title;
  const { mixName } = sf.mix;

  return `${translitTitleName ?? ""} ${titleName} ${mixName} ${
    sf.artist
  }`.toLowerCase();
}

export async function getStaticProps(
  _context: GetStaticPropsContext
): Promise<GetStaticPropsResult<AllSongsPageProps>> {
  const allSimfiles = allData.reduce<Simfile[]>((building, mix) => {
    return building.concat(mix.simfiles);
  }, []);

  const results = {
    props: {
      titles: allSimfiles.map((sm, index) => {
        return {
          id: index,
          title: {
            titleName: sm.title.titleName,
            translitTitleName: sm.title.translitTitleName,
            titleDir: sm.title.titleDir,
            banner: sm.title.banner ?? null,
          },
          mix: {
            mixName: sm.mix.mixName,
            mixDir: sm.mix.mixDir,
          },
          artist: sm.artist || "",
          types: sm.availableTypes,
          topDifficulty: sm.topDifficulty,
          stats: sm.stats,
          displayBpm: sm.displayBpm,
          minBpm: sm.minBpm,
          maxBpm: sm.maxBpm,
          stopCount: sm.stopCount,
          tempoShiftCount: getTempShiftCount(sm),
          filterString: getFilterString(sm),
        };
      }),
    },
  };

  return results;
}

export default function NextAllSongsPage(props: AllSongsPageProps) {
  return <AllSongsPage {...props} />;
}
