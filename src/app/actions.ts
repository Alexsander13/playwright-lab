"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { profileFromAuthUser } from "@/lib/supabase/profile";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const introTaskPath = "/modules/0/tasks/0-1";

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function completeIntroTaskAction() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/sign-in?next=${encodeURIComponent(introTaskPath)}`);
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .upsert(profileFromAuthUser(user), { onConflict: "id" });

  if (profileError) {
    redirect(`${introTaskPath}?saveError=1`);
  }

  const { error } = await supabase.from("user_progress").upsert(
    {
      user_id: user.id,
      module_id: "0",
      task_id: "0.1",
      is_completed: true,
      completed_at: new Date().toISOString(),
    },
    { onConflict: "user_id,module_id,task_id" },
  );

  if (error) {
    redirect(`${introTaskPath}?saveError=1`);
  }

  revalidatePath("/dashboard");
  revalidatePath(introTaskPath);
  redirect(`${introTaskPath}?completed=1`);
}