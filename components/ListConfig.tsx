import React, { useMemo, useState, useCallback } from "react";
import debounce from "lodash.debounce";
import styles from "./ListConfig.module.css";

export const LEVELS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
];

const STAT_KEYS = [
  "arrows",
  "stops",
  "jumps",
  "jacks",
  "freezes",
  "gallops",
  "bpmShifts",
  "shocks",
  "sixteenths",
  "trips",
  "complexity",
];

export const SORT_KEYS = [
  { value: "title", label: "曲名" },
  { value: "artist", label: "アーティスト" },
  { value: "level", label: "難易度値" },
  { value: "", label: "-- BPM関連 --", disabled: true },
  { value: "mainBpm", label: "メインBPM" },
  { value: "minBpm", label: "最小BPM" },
  { value: "maxBpm", label: "最大BPM" },
  { value: "stops", label: "停止回数" },
  { value: "bpmShifts", label: "変速回数" },
  { value: "", label: "-- 譜面の特徴 --", disabled: true },
  { value: "arrows", label: "ステップ数" },
  { value: "jumps", label: "ジャンプ" },
  { value: "jacks", label: "縦連" },
  { value: "freezes", label: "フリーズ" },
  { value: "gallops", label: "スキップ" },
  { value: "shocks", label: "ショック" },
  { value: "sixteenths", label: "黄矢印%" },
  { value: "trips", label: "緑矢印%" },
  { value: "", label: "-- その他 --", disabled: true },
  { value: "complexity", label: "リズム難指数(仮)" },
];

export function getSortFunction(key: string) {
  switch (key) {
    case "title":
      return (a: AllMeta, b: AllMeta) => {
        return (a.titleTranslit || a.title)
          .toLowerCase()
          .localeCompare(
            (b.titleTranslit || b.title).toLowerCase()
          );
      };
    case "artist":
      return (a: AllMeta, b: AllMeta) => {
        return (a.artist ?? "")
          .toLowerCase()
          .localeCompare(b.artist);
      };
    case "minBpm":
      /* sort in reverse order */
      return (a: AllMeta, b: AllMeta) => {
        return a.minBpm - b.minBpm;
      };
    default:
      return (a: AllMeta, b: AllMeta) => {
        const aStats = a[key as keyof Stats];
        const bStats = b[key as keyof Stats];

        return bStats - aStats;
      };
  }
}

function depluralize(s: string, count: number): string {
  if (count === 1) {
    return s.substring(0, s.length - 1);
  }

  return s;
}

export function getSortValueFunction(key: string) {
  const sortingOnStats = STAT_KEYS.findIndex((k) => k === key) !== -1;
  if (sortingOnStats) {
    return (a: AllMeta) => {
      const value = a[key as keyof Stats];
      return `${value.toString().slice(0, 5)} ${depluralize(key, value)}`;
    };
  } else if (key === "artist") {
    return (a: AllMeta) => (
      a.artist
    );
  } else if (key === "mainBpm" || key === "minBpm" || key === "maxBpm") {
    return (a: AllMeta) => {
      const main = Math.round(a.mainBpm);
      const min = Math.round(a.minBpm);
      const max = Math.round(a.maxBpm);
      return (min !== main ? `(${min})-` : '') + `${main}` + (max !== main ? `-(${max})` : '');
    };
  } else {
    return (a: AllMeta) => (
      null
    );
  }
}

const ListConfig = ({
  filter,
  sortedBy,
  levelRange,
  hardestOnly,
  onChangeFilter,
  onChangeLevelRange,
  onChangeSortedBy,
  onChangeHardestOnly,
}: {
  filter: string,
  sortedBy: string,
  levelRange: [number, number],
  hardestOnly: boolean,
  onChangeFilter: (f: string) => void,
  onChangeLevelRange: (r: [number, number]) => void,
  onChangeSortedBy: (s: string) => void,
  onChangeHardestOnly: (v: boolean) => void,
}) => {
  const [textFilter, _setTextFilter] = useState(filter);

  const updateFilter = useMemo(() => (
    debounce(onChangeFilter, 200)
  ), [onChangeFilter]);

  const setTextFilter = useCallback((newText: string) => {
    _setTextFilter(newText);
    updateFilter(newText);
  }, [_setTextFilter, updateFilter]);

  return (
    <div className={styles.filterContainer}>
      <div>
        絞り込み：
        <input
            type="text"
            className={styles.input}
            value={textFilter}
            onChange={(e) => setTextFilter(e.target.value)} />
      </div>
      <div>
        並べ替え：
        <select
            className={styles.input}
            value={sortedBy}
            onChange={(e) => onChangeSortedBy(e.target.value)}>
          {SORT_KEYS.map((k) => (
            <option key={k.value} value={k.value} disabled={k.disabled}>
              {k.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        レベル：
        <select
            className={styles.input}
            value={levelRange[0]}
            onChange={(e) => onChangeLevelRange([Number(e.target.value), levelRange[1]])}>
          {LEVELS.map((v) => (
            v <= levelRange[1] && (<option key={v} value={v}>{v}</option>)
          ))}
        </select>
        {" 〜 "}
        <select
            className={styles.input}
            value={levelRange[1]}
            onChange={(e) => onChangeLevelRange([levelRange[0], Number(e.target.value)])}>
          {LEVELS.map((v) => (
            levelRange[0] <= v && (<option key={v} value={v}>{v}</option>)
          ))}
        </select>
      </div>
      <div>
        激鬼のみ：
        <input
            type="checkbox"
            checked={hardestOnly}
            onChange={(e) => onChangeHardestOnly(!!e.target.checked)} />
      </div>
    </div>
  );
};

export default ListConfig;
