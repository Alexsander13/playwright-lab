import { LogIn, LogOut } from "lucide-react";
import Link from "next/link";

import { signOutAction } from "@/app/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/site";

export async function SiteHeader() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b border-[var(--line)]">
      <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between px-6">
        <Link className="font-semibold tracking-tight" href="/">
          {siteConfig.name}
        </Link>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-[var(--muted)] sm:block">
              {user.email}
            </span>
            <form action={signOutAction}>
              <button
                className="inline-flex min-h-10 items-center gap-2 rounded-md border border-[var(--line)] px-3 text-sm font-medium transition hover:bg-white"
                type="submit"
              >
                <LogOut aria-hidden="true" size={16} />
                <span>Выйти</span>
              </button>
            </form>
          </div>
        ) : (
          <Link
            className="inline-flex min-h-10 items-center gap-2 rounded-md bg-[var(--accent)] px-4 text-sm font-medium text-white transition hover:brightness-110"
            href="/auth/sign-in"
          >
            <LogIn aria-hidden="true" size={16} />
            <span>Войти через GitHub</span>
          </Link>
        )}
      </div>
    </header>
  );
}