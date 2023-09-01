import NextHead from "next/head";
import React from "react";
import getConfig from "next/config";

type HeadProps = {
  title: string;
  metaDescription: string;
};

function getPageTitle(incomingTitle: string): string {
  if (incomingTitle.toLowerCase().includes("stepcharts")) {
    return incomingTitle;
  } else {
    return `${incomingTitle} | Stepcharts`;
  }
}

function getAbsoluteUrl(url: string): string {
  if (url.startsWith("http")) {
    return url;
  }

  if (url.startsWith("/")) {
    url = url.substring(1);
  }

  const domain = getConfig().serverRuntimeConfig.ROOT_DOMAIN;

  return `https://${domain}/${url}`;
}

function Head({ title, metaDescription }: HeadProps) {
  return (
    <NextHead>
      <title>{getPageTitle(title)}</title>

      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content={metaDescription} />

      {/* Twitter */}
      <meta name="twitter:creator" content="mattgreer.dev" />
      <meta name="twitter:site" content="mattgreer.dev" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:image" content="/fallback_openGraph.png" />

      {/* open graph, Twitter also uses some of these */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content="/fallback_openGraph.png" />
    </NextHead>
  );
}

export { Head };
