import * as fs from "fs";
import React from "react";
import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { AllSongsPage } from "../../components/pages/all-songs";
import type { AllSongsPageProps } from "../../components/pages/all-songs";
import type { AllChartsData } from "../../scripts/genAllStepchartData";

export async function getStaticProps(): Promise<GetStaticPropsResult<AllSongsPageProps>> {
  const charts = JSON.parse(
    fs.readFileSync("_data/allCharts.json", "utf-8"),
  ) as AllChartsData;

  return {
    props: { titles: charts },
  };
}

export default function NextAllSongsPage(props: AllSongsPageProps) {
  return <AllSongsPage {...props} />;
}
