import React from "react";
import { Root } from "../layout/Root";
import { CompactMixCard } from "./CompactMixCard";
import { AllMixesData } from "../../scripts/genAllStepchartData";

type IndexPageProps = {
  mixes: AllMixesData;
};

function IndexPage({ mixes }: IndexPageProps) {
  return (
    <Root title="Stepcharts" metaDescription="DDR Stepcharts">
      <h2 className="text-gray-500 text-sm mt-12 mb-4 ml-4">Browse by versions:</h2>
      <ul
          className="grid items-start"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(276px, 1fr))",
            columnGap: "2rem",
            rowGap: "2rem",
          }}
      >
        { mixes.map((mix) => <CompactMixCard key={mix.mixId} mix={mix} />) }
      </ul>
    </Root>
  );
}

export { IndexPage };
export type { IndexPageProps };
