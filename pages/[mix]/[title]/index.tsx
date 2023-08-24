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
  const index = JSON.parse(
    fs.readFileSync("_data/index.json", "utf-8"),
  ) as Index;

  return {
    paths: index.flatMap((mix) => mix.songs.map((song) => ({
      params: { mix: mix.id, title: song.id },
    }))),
    fallback: false,
  };
}

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<AllSongsPageProps>> {
  const mixId = context.params!.mix as string;
  const songId = context.params!.title as string;

  const titles = JSON.parse(
    fs.readFileSync(`_data/${mixId}/${songId}/all.json`, "utf-8"),
  ) as AllMeta[];

  const results: GetStaticPropsResult<AllSongsPageProps> = {
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
