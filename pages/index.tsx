import * as fs from "fs";
import React from "react";
import { GetStaticPropsResult } from "next";
import entireMixes from "../lib/allStepchartData";
import { IndexPage } from "../components/pages/index";
import { IndexPageProps } from "../components/pages/index";

export async function getStaticProps(): Promise<
  GetStaticPropsResult<IndexPageProps>
> {
  const allMixes = fs.readFileSync("_data/allMixes.json", "utf-8")
  return {
    props: { mixes: JSON.parse(allMixes) },
  };
}

export default function NextIndexPage(props: IndexPageProps) {
  return <IndexPage {...props} />;
}
