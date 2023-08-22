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
import type { ChartData, AllChartsData } from "../../../../scripts/genAllStepchartData";

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const allCharts = JSON.parse(
    fs.readFileSync("_data/allCharts.json", "utf-8"),
  ) as AllChartsData;

  return {
    paths: allCharts.map((chart) => ({
      params: {
        mix: chart.mix.id,
        title: chart.song.id,
        type: chart.chart.difficulty,
      },
    })),
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
      mix: chartData.mix,
      song: chartData.song,
      chart: chartData.chart,
    },
  };
}

export default function NextSongDifficultyTypePage(props: StepchartPageProps) {
  return <StepchartPage {...props} />;
}
