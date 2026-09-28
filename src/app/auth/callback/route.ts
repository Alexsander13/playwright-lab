import { NextRequest, NextResponse } from "next/server";

import { getSafeInternalPath } from "@/lib/auth-redirect";
import { profileFromAuthUser } from "@/lib/supabase/profile";
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { error: profileError } = await supabase.from("profiles").upsert(
      profileFromAuthUser(user),
      { onConflict: "id" },
    );

    if (profileError) {
      return NextResponse.redirect(
        new URL("/?authError=profile", request.url),
      );
    }
  }

  return NextResponse.redirect(new URL(nextPath, request.url));
}