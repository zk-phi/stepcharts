import React from "react";
import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next";
import allData from "../../lib/allStepchartData";
import { MixPage } from "../../components/pages/[mix]";
import type { MixPageProps } from "../../components/pages/[mix]";

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

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<MixPageProps>> {
  const mixDir = context.params!.mix as string;
  const mix = allData.find((m) => m.mixDir === mixDir)!;

  const results = {
    props: {
      mix,
      titles: mix.simfiles,
    },
  };

  return results;
}

export default function NextMixIndexPage(props: MixPageProps) {
  return <MixPage {...props} />;
}
