import React, { ReactElement } from "react";
import Link from "next/link";

import styles from "./Breadcrumbs.module.css";

type Crumb = {
  display: string;
  pathSegment: string;
};

type BreadcrumbsProps = {
  className?: string;
  crumbs: Crumb[];
};

function buildLink(crumb: Crumb, crumbs: Crumb[]): string {
  const targetCrumbIndex = crumbs.indexOf(crumb);
  const gathered = crumbs.reduce<string[]>((building, curCrumb, index) => {
    if (index > targetCrumbIndex) {
      return building;
    }

    return building.concat(curCrumb.pathSegment);
  }, []);

  const path = `${gathered.join("/")}`;

  return path || "/";
}

const ROOT_CRUMB = { display: "Mixes", pathSegment: "" };

function Breadcrumbs({ className, crumbs }: BreadcrumbsProps) {
  const entries = [ROOT_CRUMB].concat(crumbs).map((crumb, index, array) => {
    if (index === array.length - 1) {
      return (
        <li key={crumb.pathSegment} className={styles.breadcrumbEntry}>
          {crumb.display}
        </li>
      );
    }

    return (
      <li key={crumb.pathSegment} className={styles.breadcrumbEntry}>
        <Link href={buildLink(crumb, array)}>
          <a className={styles.breadcrumbEntryLink}>
            {crumb.display}
          </a>
        </Link>
      </li>
    );
  }, []);

  return (
    <nav>
      <ul className={styles.breadcrumb}>{entries}</ul>
    </nav>
  );
}

export { Breadcrumbs };
