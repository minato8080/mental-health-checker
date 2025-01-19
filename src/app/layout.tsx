import "@/app/globals.css";
import { Quicksand } from "next/font/google";

import type { Metadata } from "next";

const quicksand = Quicksand({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "心の健康",
  description: "Check your mental health level.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        {/*iOS用*/}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        {/*Android用*/}
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={quicksand.className}>{children}</body>
    </html>
  );
}
