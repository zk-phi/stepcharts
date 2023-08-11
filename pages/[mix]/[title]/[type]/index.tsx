import React from "react";
import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next";

import allData from "../../../../lib/allStepchartData";
import { StepchartPage } from "../../../../components/pages/[mix]/[title]/[type]";
import type { StepchartPageProps } from "../../../../components/pages/[mix]/[title]/[type]";
import { Step } from "@material-ui/core";

export async function getStaticPaths(
  _context: GetStaticPathsContext
): Promise<GetStaticPathsResult> {
  const allSimfiles = allData.reduce<Simfile[]>((building, mix) => {
    return building.concat(mix.simfiles);
  }, []);

  const allSdts = allSimfiles.reduce<SongDifficultyType[]>(
    (building, stepchart) => {
      const sdts = stepchart.availableTypes.map((type) => {
        return {
          title: stepchart.title,
          mix: stepchart.mix,
          type,
        };
      });

      return building.concat(sdts);
    },
    []
  );

  return {
    paths: allSdts.map((sdt) => ({
      params: {
        mix: sdt.mix.mixDir,
        title: sdt.title.titleDir,
        type: sdt.type.difficulty,
      },
    })),
    fallback: false,
  };
}

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<StepchartPageProps>> {
  const mixDir = context.params!.mix as string;
  const titleDir = context.params!.title as string;
  const type = context.params!.type as string;

  const simfile = allData
    .find((m) => m.mixDir === mixDir)!
    .simfiles.find((s) => s.title.titleDir === titleDir)!;

  const results = {
    props: {
      simfile,
      currentType: type,
    },
  };

  return results;
}

export default function NextSongDifficultyTypePage(props: StepchartPageProps) {
  return <StepchartPage {...props} />;
}
