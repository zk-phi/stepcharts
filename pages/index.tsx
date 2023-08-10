import React from "react";
import { GetStaticPropsResult } from "next";
import entireMixes from "../lib/allStepchartData";
import { IndexPage } from "../components/pages/IndexPage";
import { IndexPageProps } from "../components/pages/IndexPage";

export async function getStaticProps(): Promise<
  GetStaticPropsResult<IndexPageProps>
> {
  return {
    props: { mixes: entireMixes },
  };
}

export default function NextIndexPage(props: IndexPageProps) {
  return <IndexPage {...props} />;
}
