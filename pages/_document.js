import { Html, Head, Main, NextScript } from "next/document";
import Link from "next/link";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2478846957520898"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
        <Link
          href="/transparency"
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            bottom: "5vh",
            textDecoration: "none",
          }}
        >
          Privacy Policy | Terms of Service
        </Link>
      </body>
    </Html>
  );
}
