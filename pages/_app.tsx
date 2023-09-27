import "../styles/index.css";
import "../styles/modern-normalize.min.css";

function MyApp({ Component, pageProps }: { Component: any; pageProps: any }) {
  return <Component {...pageProps} />;
}

export default MyApp;
