import React from "react";
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

function buildMixUrl(mix: MixMeta): string {
  return `/${mix.mixId}`;
}

function CompactMixCard({ mix }: CompactMixCardProps) {
  return (
    <a href={buildMixUrl(mix)} className={style.card}>
      <div>
        <b>{mix.name}</b> <small>{mix.year}</small>
      </div>
      <div className={style.songCount}>
        <small>{mix.songs} {pluralize("song", mix.songs)}</small>
      </div>
    </a>
  );
}

export { CompactMixCard };
