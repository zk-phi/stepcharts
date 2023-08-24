import * as fs from "fs";
import React from "react";
import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next";
import { MixPage } from "../../components/pages/[mix]";
import type { MixPageProps } from "../../components/pages/[mix]";
import type { AllMixesData, MixData } from "../../scripts/genAllStepchartData";

export async function getStaticPaths(
  _context: GetStaticPathsContext
): Promise<GetStaticPathsResult> {
  const allMixes = JSON.parse(
    fs.readFileSync("_data/allMixes.json", "utf-8"),
  ) as AllMixesData;

  return {
    paths: allMixes.map((mix) => ({ params: { mix: mix.mixId } })),
    fallback: false,
  };
}

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<MixPageProps>> {
  const id = context.params!.mix as string;
  const mix = JSON.parse(
    fs.readFileSync(`_data/${id}/data.json`, "utf-8"),
  ) as MixData;

  return {
    props: { mix },
  };
}

export default function NextMixIndexPage(props: MixPageProps) {
  return <MixPage {...props} />;
}
