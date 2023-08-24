import React from "react";
import { getStaticPaths, getStaticProps } from "../";
import PreviewPage from "../../../../../components/pages/[mix]/[title]/[type]/preview";
import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next";

const ChartPreviewPage = ({ chart }: {
  chart: Stepchart,
}) => {
  return (
    <PreviewPage chart={chart} />
  );
};

export { getStaticProps, getStaticPaths };
export default ChartPreviewPage;
