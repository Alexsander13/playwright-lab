"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { profileFromAuthUser } from "@/lib/supabase/profile";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { courseTasks, getCourseTask } from "@/lib/course-tasks";

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function completeCourseTaskAction(formData: FormData) {
  const moduleId = formData.get("moduleId");
  const slug = formData.get("slug");
  const task =
    typeof moduleId === "string" && typeof slug === "string"
      ? getCourseTask(moduleId, slug)
      : undefined;

  if (!task) {
    redirect("/dashboard");
  }

  const taskPath = `/modules/${task.moduleId}/tasks/${task.slug}`;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/sign-in?next=${encodeURIComponent(taskPath)}`);
  }

  const { data: existingProgress, error: progressReadError } = await supabase
    .from("user_progress")
    .select("module_id, task_id, is_completed");

  if (progressReadError) {
    redirect(`${taskPath}?saveError=1`);
  }

  const completedTaskIds = new Set(
    (existingProgress ?? [])
      .filter((row) => row.is_completed)
      .map((row) => `${row.module_id}:${row.task_id}`),
  );
  const taskIndex = courseTasks.findIndex(
    (candidate) =>
      candidate.moduleId === task.moduleId && candidate.id === task.id,
  );

  if (
    courseTasks.slice(0, taskIndex).some(
      (previous) =>
        !completedTaskIds.has(`${previous.moduleId}:${previous.id}`),
    )
  ) {
    redirect(`${taskPath}?blocked=1`);
  }

  if (completedTaskIds.has(task.id)) {
    revalidatePath("/dashboard");
    redirect(`${taskPath}?completed=1`);
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .upsert(profileFromAuthUser(user), { onConflict: "id" });

  if (profileError) {
    redirect(`${taskPath}?saveError=1`);
  }

  const { error } = await supabase.from("user_progress").upsert(
    {
      user_id: user.id,
      module_id: task.moduleId,
      task_id: task.id,
      is_completed: true,
      completed_at: new Date().toISOString(),
    },
    { onConflict: "user_id,module_id,task_id" },
  );

  if (error) {
    redirect(`${taskPath}?saveError=1`);
  }

  revalidatePath("/dashboard");
  revalidatePath(taskPath);
  redirect(`${taskPath}?completed=1`);
}