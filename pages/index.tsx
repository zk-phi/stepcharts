import * as fs from "fs";
import React from "react";
import { GetStaticPropsResult } from "next";
import { IndexPage } from "../components/pages/index";
import { IndexPageProps } from "../components/pages/index";

export async function getStaticProps(): Promise<
  GetStaticPropsResult<IndexPageProps>
> {
  const mixes = JSON.parse(
    fs.readFileSync("public/_data/mixes.json", "utf-8")
  ) as MixMeta[];

  return {
    props: { mixes },
  };
}

export default function NextIndexPage(props: IndexPageProps) {
  return <IndexPage {...props} />;
}
