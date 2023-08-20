import React from "react";
import { Root } from "../layout/Root";
import { CompactMixCard } from "./CompactMixCard";

type IndexPageProps = {
  mixes: MixMeta[];
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
        { mixes.map((mix) => <CompactMixCard key={mix.id} mix={mix} />) }
      </ul>
    </Root>
  );
}

export { IndexPage };
export type { IndexPageProps };
