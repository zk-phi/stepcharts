import * as fs from "fs";
import React from "react";
import {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next";
import { AllSongsPage } from "../../../components/pages/all-songs";
import type { AllSongsPageProps } from "../../../components/pages/all-songs";

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const allCharts = JSON.parse(
    fs.readFileSync("_data/all.json", "utf-8"),
  ) as AllMeta[];

  return {
    paths: allCharts.map((chart) => ({
      params: { mix: chart.mixId, title: chart.songId },
    })),
    fallback: false,
  };
}

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<TitlePageProps>> {
  const mixId = context.params!.mix as string;
  const songId = context.params!.title as string;

  const titles = JSON.parse(
    fs.readFileSync(`_data/${mixId}/${songId}/all.json`, "utf-8"),
  ) as AllMeta[];

  const results: GetStaticPropsResult<TitlePageProps> = {
    props: {
      titles,
      crumbs: [
        { display: titles[0].name, pathSegment: titles[0].mixId },
        { display: titles[0].title, pathSegment: titles[0].songId },
      ],
    },
  };

  return results;
}

export default function NextTitleIndexPage(props: AllSongsPageProps) {
  return <AllSongsPage {...props} />;
}
