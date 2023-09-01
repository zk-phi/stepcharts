import React from "react";
import { Head } from "./Head";
import { Header } from "./Header";
import { Footer } from "./Footer";

import styles from "./Root.module.css";

type RootProps = {
  className?: string;
  title: string;
  subheading?: React.ReactNode;
  metaDescription: string;
  children: React.ReactNode;
};

function Root({
  className,
  title,
  subheading,
  metaDescription,
  children,
}: RootProps) {
  return (
    <div>
      <Head title={title} metaDescription={metaDescription} />
      <Header subheading={subheading} />
      <main role="main" className={styles.main}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

export { Root };
