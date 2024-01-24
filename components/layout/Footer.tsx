import React from "react";
import Link from "next/link";

import styles from "./Footer.module.css";

function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.paragraph}>
        This website is a fork of "
        <a className={styles.link} target="_blank" href="https://ddr.stepcharts.com">
          Stepcharts
        </a>
        " by Matt Greer.
        Chart data is made by the DDR community.
        Thank you!
      </p>
      <p>
        Modded by{" "}
        <a className={styles.link} target="_blank" href="https://twitter.com/zk_phi">
          zk-phi
        </a>
        {" ("}
        <a className={styles.link} target="_blank" href="https://github.com/zk-phi/stepcharts">
          GitHub
        </a>
        {")"}
      </p>
    </footer>
  );
}

export { Footer };
