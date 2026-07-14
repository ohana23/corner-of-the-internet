import Head from "next/head";
import "/globalStyles.css";
import { Analytics } from "@vercel/analytics/react";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Danny Ohana</title>
        
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
        
        {/* Favicon */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png?v=danny-ohana"
        ></link>
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png?v=danny-ohana"
        ></link>
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png?v=danny-ohana"
        ></link>
        <link rel="manifest" href="/site.webmanifest"></link>
        <link
          rel="mask-icon"
          href="/safari-pinned-tab.svg"
          color="#000000"
        ></link>
        <meta name="msapplication-TileColor" content="#ffffff"></meta>
        <meta name="theme-color" content="#ffffff"></meta>
        <link rel="shortcut icon" href="/favicon.ico?v=danny-ohana" />
      </Head>

      <Component {...pageProps} />
      <Analytics />
    </>
  );
}

export default MyApp;
