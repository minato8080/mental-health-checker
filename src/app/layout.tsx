import "@/app/globals.css";
import { Quicksand } from "next/font/google";

const quicksand = Quicksand({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/*iOS用*/}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        {/*Android用*/}
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={quicksand.className}>{children}</body>
    </html>
  );
}
