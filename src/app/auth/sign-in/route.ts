import { NextRequest, NextResponse } from "next/server";

import { getSafeInternalPath } from "@/lib/auth-redirect";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const nextPath = getSafeInternalPath(
    request.nextUrl.searchParams.get("next"),
    request.nextUrl.origin,
  );
  const callbackUrl = new URL("/auth/callback", request.url);
  callbackUrl.searchParams.set("next", nextPath);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: { redirectTo: callbackUrl.toString() },
  });

  if (error || !data.url) {
    return NextResponse.redirect(new URL("/?authError=oauth", request.url));
  }

  return NextResponse.redirect(data.url);
}