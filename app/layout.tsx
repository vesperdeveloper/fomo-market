import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  // pinned, because Next resolves relative metadata URLs against
  // VERCEL_URL and would otherwise point link previews at whichever
  // alias built the deployment
  metadataBase: new URL("https://fomomarket.vercel.app"),
  title: "fomo market · bet on the traders, not the tokens",
  description:
    "Binary options written on a fomo trader's account PnL. Pick a handle, pick a window, take up or down. Settled in USDG from a public snapshot record.",
  openGraph: {
    title: "fomo market · bet on the traders, not the tokens",
    description:
      "Up or down on whether a fomo trader's account PnL is green over the next day or week. Settled in USDG on Robinhood Chain.",
    images: [{ url: "/brand/og.jpg", width: 1200, height: 400 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "fomo market · bet on the traders, not the tokens",
    images: ["/brand/og.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
