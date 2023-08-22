import React from "react";
import clsx from "clsx";

import styles from "./difficultyBackgroundColors.module.css";

type StepchartTypePageItemProps = {
  className?: string;
  chart: ChartMeta;
  isLast?: boolean;
};

function StepchartTypePageItem({
  className,
  chart,
  isLast,
}: StepchartTypePageItemProps) {
  return (
    <div
      className={clsx(className, styles.root, "grid grid-cols-2 bg-gray-900")}
    >
      <div
        className={clsx(
          "bg-focal-100 text-focal-700 p-2 border-b border-gray-900",
          { "border-none": isLast },
        )}
      >
        <div className="text-right">{chart.difficulty}</div>
      </div>
      <div
        className="px-2 flex-1 flex flex-row pr-3 items-center justify-start"
        aria-label={`difficulty rating of ${chart.level}`}
      >
        <div className={clsx(styles[chart.difficulty], "w-7 h-7")} />
        <div className="ml-2 text-white">{chart.level}</div>
      </div>
    </div>
  );
}

export { StepchartTypePageItem };
