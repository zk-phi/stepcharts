import React from "react";
import Link from "next/link";
import style from "./CompactMixCart.module.css";

type CompactMixCardProps = {
  className?: string;
  mix: MixMeta;
};

function pluralize(str: string, count: number): string {
  if (count === 1) {
    return str;
  }
  return str + "s";
}

function CompactMixCard({ mix }: CompactMixCardProps) {
  return (
    <Link href={`/${mix.mixId}`}>
      <a className={style.card}>
        <div>
          <b>{mix.name}</b> <small>{mix.year}</small>
        </div>
        <div className={style.songCount}>
          <small>{mix.songs} {pluralize("song", mix.songs)}</small>
        </div>
      </a>
    </Link>
  );
}

export { CompactMixCard };
