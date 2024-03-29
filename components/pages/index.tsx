import React from "react";
import Link from "next/link";
import { Root } from "../layout/Root";

import styles from "./index.module.css";

type IndexPageProps = {
  mixes: MixMeta[];
};

function pluralize(str: string, count: number): string {
  if (count === 1) {
    return str;
  }
  return str + "s";
}

function IndexPage({ mixes }: IndexPageProps) {
  return (
    <Root title="Stepcharts" metaDescription="DDR Stepcharts">
      <h2 className={styles.h2}>Browse by versions:</h2>
      <ul className={styles.grid}>
        {mixes.map((mix) => (
          <Link href={`/${mix.mixId}`}>
            <a className={styles.card}>
              <div>
                <b>{mix.name}</b> <small>{mix.year}</small>
              </div>
              <div className={styles.songCount}>
                <small>{mix.songs} {pluralize("song", mix.songs)}</small>
              </div>
            </a>
          </Link>
        ))}
      </ul>
    </Root>
  );
}

export { IndexPage };
export type { IndexPageProps };
