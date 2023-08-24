import * as fs from "fs";
import React from "react";
import {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next";
import { AllSongsPage } from "../../components/pages/all-songs";
import type { AllSongsPageProps } from "../../components/pages/all-songs";

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const allMixes = JSON.parse(
    fs.readFileSync("_data/mixes.json", "utf-8"),
  ) as AllMixesData;

  return {
    paths: allMixes.map((mix) => ({ params: { mix: mix.mixId } })),
    fallback: false,
  };
}

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<AllSongsPageProps>> {
  const id = context.params!.mix as string;
  const titles = JSON.parse(
    fs.readFileSync(`_data/${id}/all.json`, "utf-8"),
  ) as AllMeta[];

  return {
    props: {
      titles,
      crumbs: [{ display: titles[0].name, pathSegment: titles[0].mixId }],
    },
  };
}

export default function NextMixIndexPage(props: AllSongsPageProps) {
  return <AllSongsPage {...props} />;
}
