import React from "react";
import Link from "next/link";

import styles from "./Footer.module.css";

function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.paragraph}>
        This website is a fork of "Stepcharts" by Matt Greer.
        Chart data is made by the DDR community.
        Thank you!
      </p>
      <p>
        Modded by{" "}
        <a className={styles.link} href="https://twitter.com/zk_phi">
          zk-phi
        </a>
        {" ("}
        <a className={styles.link} href="https://github.com/zk-phi/stepcharts">
          GitHub
        </a>
        )
      </p>
    </footer>
  );
}

export { Footer };
