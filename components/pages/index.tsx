import React from "react";
import { Root } from "../layout/Root";
import { CompactMixCard } from "./CompactMixCard";

import styles from "./index.module.css";

type IndexPageProps = {
  mixes: MixMeta[];
};

function IndexPage({ mixes }: IndexPageProps) {
  return (
    <Root title="Stepcharts" metaDescription="DDR Stepcharts">
      <h2 className={styles.h2}>Browse by versions:</h2>
      <ul className={styles.grid}>
        { mixes.map((mix) => <CompactMixCard key={mix.mixId} mix={mix} />) }
      </ul>
    </Root>
  );
}

export { IndexPage };
export type { IndexPageProps };
