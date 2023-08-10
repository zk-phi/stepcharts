import React from "react";
import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next";
import allData from "../../lib/allStepchartData";
import { MixPage } from "../../components/pages/[mix]/MixPage";
import type { MixPageProps } from "../../components/pages/[mix]/MixPage";
import { calculateStats } from "../../lib/calculateStats";

export async function getStaticPaths(
  _context: GetStaticPathsContext
): Promise<GetStaticPathsResult> {
  return {
    paths: allData.map((mix) => ({ params: { mix: mix.mixDir } })),
    fallback: false,
  };
}

// used as the tie breaker when one song has more than one chart with the same max feet
const difficultyPriority = [
  "expert",
  "challenge",
  "difficult",
  "basic",
  "beginner",
];

function getMostDifficultChart(simfile: Simfile) {
  const { availableTypes: types, charts } = simfile;
  const maxFeet = Math.max(...types.map((t) => t.feet));

  const maxFeetTypes = types.filter((t) => t.feet === maxFeet);

  for (let i = 0; i < difficultyPriority.length; ++i) {
    const matchingType = maxFeetTypes.find(
      (mft) => mft.difficulty === difficultyPriority[i]
    );

    if (matchingType) {
      return charts[matchingType.difficulty];
    }
  }

  throw new Error("getMostDifficultChart, failed to get a chart");
}

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<MixPageProps>> {
  const mixDir = context.params!.mix as string;
  const mix = allData.find((m) => m.mixDir === mixDir)!;

  const results = {
    props: {
      mix,
      titles: mix.simfiles.map((sm) => {
        return {
          title: {
            titleDir: sm.title.titleDir,
            titleName: sm.title.titleName,
            translitTitleName: sm.title.translitTitleName,
            banner: sm.title.banner,
          },
          types: sm.availableTypes,
          displayBpm: sm.displayBpm,
          stats: calculateStats(getMostDifficultChart(sm)),
        };
      }),
    },
  };

  return results;
}

export default function NextMixIndexPage(props: MixPageProps) {
  return <MixPage {...props} />;
}
