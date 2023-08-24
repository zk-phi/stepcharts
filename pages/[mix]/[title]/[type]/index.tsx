import * as fs from "fs";
import React from "react";
import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next";
import { StepchartPage } from "../../../../components/pages/[mix]/[title]/[type]";
import type { StepchartPageProps } from "../../../../components/pages/[mix]/[title]/[type]";

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const index = JSON.parse(
    fs.readFileSync("_data/index.json", "utf-8"),
  ) as Index;

  return {
    paths: index.flatMap((mix) => mix.songs.flatMap((song) => song.charts.map((chart) => ({
      params: {
        mix: mix.id,
        title: song.id,
        type: chart.difficulty,
      },
    })))),
    fallback: false,
  };
}

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<StepchartPageProps>> {
  const mixId = context.params!.mix as string;
  const songId = context.params!.title as string;
  const difficulty = context.params!.type as string;

  const chartData = JSON.parse(
    fs.readFileSync(`_data/${mixId}/${songId}/${difficulty}.json`, "utf-8"),
  ) as ChartData;

  return {
    props: {
      chart: chartData,
    },
  };
}

export default function NextSongDifficultyTypePage(props: StepchartPageProps) {
  return <StepchartPage {...props} />;
}
