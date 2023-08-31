import React from "react";
import Link from "next/link";
import clsx from "clsx";

import styles from "./Footer.module.css";

type FooterProps = {
  className?: string;
};

function Footer({ className }: FooterProps) {
  return (
    <footer
      className={clsx(
        className,
        "bg-focal-100 text-focal-700 py-2 px-2 sm:p-4 text-center text-xs xborder-t border-focal-400"
      )}
    >
      <div className="w-full max-w-6xl mx-auto flex flex-col space-y-2">
        <div className="text-focal-400">
          <p>All songs, artwork and step charts are property of Konami</p>
          <p>Step charts were made by the DDR community, thank you!</p>
        </div>
        <div>
          Made by{" "}
          <a className="text-link hover:underline" href="https://mattgreer.dev">
            Matt Greer
          </a>
          <span className="mx-2">&#124;</span>
          <a
            className="text-link hover:underline"
            href="https://github.com/city41/stepcharts"
          >
            GitHub repo
          </a>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
