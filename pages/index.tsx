import * as fs from "fs";
import React from "react";
import { GetStaticPropsResult } from "next";
import { IndexPage } from "../components/pages/index";
import { IndexPageProps } from "../components/pages/index";
import type { AllMixesData } from "../scripts/genAllStepchartData";

export async function getStaticProps(): Promise<
  GetStaticPropsResult<IndexPageProps>
> {
  const mixes = JSON.parse(
    fs.readFileSync("_data/allMixes.json", "utf-8")
  ) as AllMixesData;

  return {
    props: { mixes },
  };
}

export default function NextIndexPage(props: IndexPageProps) {
  return <IndexPage {...props} />;
}
