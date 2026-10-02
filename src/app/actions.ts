"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { profileFromAuthUser } from "@/lib/supabase/profile";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CourseTaskActionState } from "@/lib/course-progress";
import { courseTasks, getCourseTask } from "@/lib/course-tasks";

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function completeCourseTaskAction(
  _previousState: CourseTaskActionState,
  formData: FormData,
): Promise<CourseTaskActionState> {
  const moduleId = formData.get("moduleId");
  const slug = formData.get("slug");
  const task =
    typeof moduleId === "string" && typeof slug === "string"
      ? getCourseTask(moduleId, slug)
      : undefined;

  if (!task) {
    return { status: "error", message: "Не удалось определить задачу." };
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
    return {
      status: "error",
      message: "Не удалось загрузить прогресс. Попробуйте ещё раз.",
    };
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
    return {
      status: "error",
      message: "Сначала завершите предыдущие задачи курса.",
    };
  }

  if (completedTaskIds.has(`${task.moduleId}:${task.id}`)) {
    revalidatePath("/dashboard");
    return {
      status: "success",
      message: `Задача ${task.id} уже отмечена выполненной.`,
    };
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .upsert(profileFromAuthUser(user), { onConflict: "id" });

  if (profileError) {
    return {
      status: "error",
      message: "Не удалось подготовить профиль для сохранения прогресса.",
    };
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
    return {
      status: "error",
      message: "Не удалось сохранить выполнение. Попробуйте ещё раз.",
    };
  }

  revalidatePath("/dashboard");
  return {
    status: "success",
    message: `Задача ${task.id} выполнена. Прогресс сохранён.`,
  };
}
