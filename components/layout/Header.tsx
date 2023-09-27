import React from "react";
import Link from "next/link";
import styles from "./Header.module.css";

export const Header = ({ subheading }: {
  subheading?: React.ReactNode,
}) => (
  <header className={styles.header}>
    <div className={styles.outer}>
      <Link href="/">
        <a className={styles.title}>Stepcharts</a>
      </Link>
      <Link href="/all-songs">
        <a className={styles.link}>
          all songs
        </a>
      </Link>
    </div>
    {subheading}
  </header>
);
