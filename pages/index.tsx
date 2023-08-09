import React from "react";
import { GetStaticPropsResult } from "next";
import entireMixes from "../lib/allStepchartData";
import { dateReleased, groupedOrder } from "../lib/meta";
import { IndexPage } from "../components/pages/IndexPage";
import { IndexPageMix, IndexPageProps } from "../components/pages/IndexPage";

export const config = {
  unstable_runtimeJS: false,
};

export async function getStaticProps(): Promise<
  GetStaticPropsResult<IndexPageProps>
> {
  const mixes: IndexPageMix[] = entireMixes.map((em) => {
    return {
      mixName: em.mixName,
      mixDir: em.mixDir,
      songCount: em.songCount,
      yearReleased: new Date(dateReleased[em.mixDir]).getFullYear(),
    };
  });

  const grouped = Object.keys(groupedOrder).reduce<IndexPageProps["mixes"]>(
    (building, groupTitle) => {
      building[groupTitle] = (groupedOrder[groupTitle] as string[]).reduce<
        IndexPageMix[]
      >((buildingGroup, mixDir) => {
        const mix = mixes.find((m) => m.mixDir === mixDir);

        if (mix) {
          return buildingGroup.concat(mix);
        } else {
          return buildingGroup;
        }
      }, []);

      return building;
    },
    {}
  );

  return {
    props: { mixes: grouped },
  };
}

export default function NextIndexPage(props: IndexPageProps) {
  return <IndexPage {...props} />;
}
