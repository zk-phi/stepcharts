import React from "react";
import { GetStaticPropsResult } from "next";
import entireMixes from "../lib/allStepchartData";
import { dateReleased } from "../lib/meta";
import { IndexPage } from "../components/pages/IndexPage";
import { IndexPageMix, IndexPageProps } from "../components/pages/IndexPage";

export const config = {
  unstable_runtimeJS: false,
};

export async function getStaticProps(): Promise<
  GetStaticPropsResult<IndexPageProps>
> {
  const mixesWithYear: IndexPageMix[] = entireMixes.map((em) => {
    return {
      mixName: em.mixName,
      mixDir: em.mixDir,
      songCount: em.songCount,
      yearReleased: new Date(dateReleased[em.mixDir]).getFullYear(),
    };
  }).sort((a, b) => (
    a.yearReleased - b.yearReleased
  ));

  return {
    props: { mixes: mixesWithYear },
  };
}

export default function NextIndexPage(props: IndexPageProps) {
  return <IndexPage {...props} />;
}
