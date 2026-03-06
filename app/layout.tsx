import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Barros Builds — Data & AI Products",
  description: "Data analyst turned product builder. Shipping AI-powered products in 2026.",
  openGraph: {
    title: "Barros Builds — Data & AI Products",
    description: "Data analyst turned product builder. Shipping AI-powered products in 2026.",
    url: "https://barrosbuilds.com",
    siteName: "Barros Builds",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Barros Builds — Data & AI Products",
    description: "Data analyst turned product builder. Shipping AI-powered products in 2026.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@300;400;500&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
