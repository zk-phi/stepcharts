import React from "react";
import { Root } from "../layout/Root";
import { CompactMixCard } from "../CompactMixCard";

type IndexPageMix = {
  mixName: string;
  mixDir: string;
  songCount: number;
  yearReleased: number;
};

type IndexPageProps = {
  mixes: Record<string, IndexPageMix[]>;
};

function IndexPage({ mixes }: IndexPageProps) {
  const mixEls = Object.keys(mixes).map((groupName) => {
    const mixesInGroup = mixes[groupName].map((mix) => {
      return <CompactMixCard key={mix.mixDir} mix={mix} />;
    });

    return (
      <React.Fragment key={groupName}>
        <h2 className="text-gray-500 text-sm mt-12 mb-4 ml-4">{groupName}</h2>
        <ul
          className="grid items-start"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(276px, 1fr))",
            columnGap: "2rem",
            rowGap: "2rem",
          }}
        >
          {mixesInGroup}
        </ul>
      </React.Fragment>
    );
  });

  return (
    <Root title="Stepcharts" metaDescription="DDR Stepcharts">
      {mixEls}
    </Root>
  );
}

export { IndexPage };
export type { IndexPageMix, IndexPageProps };
