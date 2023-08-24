import * as fs from "fs";
import React from "react";
import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { AllSongsPage } from "../../components/pages/all-songs";
import type { AllSongsPageProps } from "../../components/pages/all-songs";

export async function getStaticProps(): Promise<GetStaticPropsResult<AllSongsPageProps>> {
  const titles = JSON.parse(
    fs.readFileSync("_data/all.json", "utf-8"),
  ) as AllMeta[];

  return {
    props: { titles },
  };
}

export default function NextAllSongsPage(props: AllSongsPageProps) {
  return <AllSongsPage {...props} />;
}
