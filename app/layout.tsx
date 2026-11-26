import type { Metadata, Viewport } from "next";
import "./tokens.css";
import "./site.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ember.app"),
  title: "Ember — small habits, quietly kept for life",
  description:
    "Pick one tiny habit, check in each morning with one tap, and watch your year fill in. Free to start, $2.99/month for unlimited rituals. A minute a day, kept.",
  openGraph: {
    title: "Ember — small habits, quietly kept for life",
    description:
      "One habit, one tap, sixty seconds a day. A year-in-pixels view you'll want to keep filling.",
    url: "https://ember.app",
    siteName: "Ember",
    images: [{ url: "/stock/ember-morning.jpg", width: 6000, height: 4000 }],
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#F7F4EE",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
