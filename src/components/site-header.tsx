import Link from "next/link";

import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="border-b border-[var(--line)]">
      <div className="mx-auto flex min-h-16 max-w-6xl items-center px-6">
        <Link className="font-semibold tracking-tight" href="/">
          {siteConfig.name}
        </Link>
      </div>
    </header>
  );
}