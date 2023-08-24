import * as fs from "fs";
import React from "react";
import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next";
import { TitlePage } from "../../../components/pages/[mix]/[title]";
import type { TitlePageProps } from "../../../components/pages/[mix]/[title]";
import type { AllChartsData, SongData } from "../../../scripts/genAllStepchartData";

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const allCharts = JSON.parse(
    fs.readFileSync("_data/allCharts.json", "utf-8"),
  ) as AllChartsData;

  return {
    paths: allCharts.map((chart) => ({
      params: { mix: chart.mix.mixId, title: chart.song.songId },
    })),
    fallback: false,
  };
}

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<TitlePageProps>> {
  const mixId = context.params!.mix as string;
  const songId = context.params!.title as string;

  const songData = JSON.parse(
    fs.readFileSync(`_data/${mixId}/${songId}/data.json`, "utf-8"),
  ) as SongData;

  const results: GetStaticPropsResult<TitlePageProps> = {
    props: {
      song: songData.song,
      mix: songData.mix,
    },
  };

  return results;
}

export default function NextTitleIndexPage(props: TitlePageProps) {
  return <TitlePage {...props} />;
}
