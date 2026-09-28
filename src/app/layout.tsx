import type { Metadata } from "next";

import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}