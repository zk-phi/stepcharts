import React from "react";
import clsx from "clsx";
import { ImageFrame } from "../ImageFrame";

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
  return `/${mix.id}`;
}

function CompactMixCard({ className, mix }: CompactMixCardProps) {
  return (
    <ImageFrame
      className={clsx(
        className,
        clsx(
          "flex flex-col bg-gray-900 overflow-hidden rounded-tl-2xl rounded-br-2xl"
        )
      )}
    >
      <div
        className={clsx("grid bg-gray-600 items-center pl-3")}
        style={{ gridTemplateColumns: "1fr max-content" }}
      >
        <div>
          <a
            href={buildMixUrl(mix)}
            className="inline-block xfont-bold text-white px-1"
          >
            {mix.name}
          </a>
        </div>
      </div>

      <div>
        <a href={buildMixUrl(mix)}>
          <div
            className="relative bg-cover border-b border-t border-white"
            style={{
              paddingTop: "calc(80 / 256 * 100%)",
            }}
          >
            <img
              className="absolute top-0 left-0 w-full h-full"
              src={mix.bannerSrc || ""}
              alt={`${mix.name} banner`}
              loading="lazy"
            />
          </div>
        </a>
      </div>

      <div className="text-gray-100 bg-gray-400 text-sm px-3 py-1 text-center flex flex-row justify-between">
        <div>{mix.year}</div>
        <div>
          <span className="font-bold">{mix.songs}</span>{" "}
          {pluralize("song", mix.songs)}
        </div>
      </div>
    </ImageFrame>
  );
}

export { CompactMixCard };
