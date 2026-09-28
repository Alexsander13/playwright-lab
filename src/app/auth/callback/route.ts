import { NextRequest, NextResponse } from "next/server";

import { getSafeInternalPath } from "@/lib/auth-redirect";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const nextPath = getSafeInternalPath(
    request.nextUrl.searchParams.get("next"),
    request.nextUrl.origin,
  );
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      new URL("/?authError=callback", request.url),
    );
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL("/?authError=callback", request.url),
    );
  }

  return NextResponse.redirect(new URL(nextPath, request.url));
}