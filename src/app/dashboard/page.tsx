import { redirect } from "next/navigation";
import Link from "next/link";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { courseModules, courseTaskCount } from "@/lib/course";
import { courseTasks } from "@/lib/course-tasks";

type ProgressRow = {
  module_id: string;
  task_id: string;
  is_completed: boolean;
};

function isProgressRow(value: unknown): value is ProgressRow {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const row = value as Record<string, unknown>;
  return (
    typeof row.module_id === "string" &&
    typeof row.task_id === "string" &&
    typeof row.is_completed === "boolean"
  );
}

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in?next=%2Fdashboard");
  }

  const { data, error } = await supabase
    .from("user_progress")
    .select("module_id, task_id, is_completed");

  const progressRows = (data ?? []).filter(isProgressRow);
  const completedByModule = new Map<string, Set<string>>();

  for (const row of progressRows) {
    if (!row.is_completed) {
      continue;
    }

    const completedTasks = completedByModule.get(row.module_id) ?? new Set();
    completedTasks.add(row.task_id);
    completedByModule.set(row.module_id, completedTasks);
  }

  const completedTaskCount = courseModules.reduce(
    (total, courseModule) =>
      total + (completedByModule.get(courseModule.id)?.size ?? 0),
    0,
  );
  const completionPercent = Math.round(
    (completedTaskCount / courseTaskCount) * 100,
  );
  const nextCourseTask = courseTasks.find(
    (task) => !completedByModule.get(task.moduleId)?.has(task.id),
  );
  const learnerName =
    user.user_metadata.user_name ??
    user.user_metadata.name ??
    user.email?.split("@")[0] ??
    "участник";

  return (
    <main className="mx-auto min-h-[calc(100svh-4rem)] max-w-6xl px-6 py-10 sm:py-14">
      <section className="border-b border-[var(--line)] pb-8">
        <p className="text-sm font-medium text-[var(--accent)]">Личный кабинет</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Ваш путь в Playwright
        </h1>
        <p className="mt-3 text-base text-[var(--muted)]">
          Рады видеть вас, {learnerName}.
        </p>
      </section>

      <section
        aria-label="Общий прогресс курса"
        className="grid gap-6 border-b border-[var(--line)] py-7 sm:grid-cols-[1fr_auto] sm:items-end"
      >
        <div>
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-lg font-semibold">Прогресс курса</h2>
            <p className="text-sm tabular-nums text-[var(--muted)]">
              {completedTaskCount} из {courseTaskCount} задач
            </p>
          </div>
          <div
            aria-label={`${completionPercent}% выполнено`}
            className="mt-4 h-2 overflow-hidden rounded-full bg-[#dce3de]"
            role="img"
          >
            <div
              className="h-full rounded-full bg-[var(--accent)] transition-[width]"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>
        <p className="text-3xl font-semibold tabular-nums">{completionPercent}%</p>
      </section>

      {error ? (
        <p className="mt-6 border-l-2 border-red-600 pl-3 text-sm text-red-800" role="alert">
          Не удалось загрузить прогресс. Обновите страницу чуть позже.
        </p>
      ) : null}

      <section aria-labelledby="modules-heading" className="pt-8">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-xl font-semibold" id="modules-heading">
            Программа курса
          </h2>
          <span className="text-sm text-[var(--muted)]">10 модулей · 59 задач</span>
        </div>

        <ol className="mt-4 divide-y divide-[var(--line)]">
          {courseModules.map((courseModule, index) => {
            const completedTasks = completedByModule.get(courseModule.id) ?? new Set();
            const completedCount = completedTasks.size;
            const completedLessons =
              courseModule.tasks?.filter((task) => completedTasks.has(task.id)) ?? [];
            const modulePercent = Math.round(
              (completedCount / courseModule.taskCount) * 100,
            );
            const nextTask =
              nextCourseTask?.moduleId === courseModule.id
                ? courseModule.tasks?.find(
                    (task) => task.id === nextCourseTask.id,
                  )
                : undefined;

            return (
              <li
                className="grid gap-4 py-5 sm:grid-cols-[3rem_minmax(0,1fr)_8rem_12rem] sm:items-center"
                key={courseModule.id}
              >
                <span className="text-sm font-semibold tabular-nums text-[var(--accent)]">
                  {String(index).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-semibold">{courseModule.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                    {courseModule.summary}
                  </p>
                  {nextTask ? (
                    <Link
                      className="mt-2 inline-flex min-h-9 items-center text-sm font-medium text-[var(--accent)] underline underline-offset-4"
                      href={`/modules/${courseModule.id}/tasks/${nextTask.slug}`}
                    >
                      {completedCount === 0 ? "Начать" : "Продолжить"}: {nextTask.title}
                    </Link>
                  ) : courseModule.tasks?.length && completedCount === courseModule.taskCount ? (
                    <p className="mt-2 text-sm font-medium text-[var(--accent)]">
                      Все задачи модуля завершены
                    </p>
                  ) : courseModule.tasks?.length && nextCourseTask?.moduleId !== courseModule.id ? (
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      Завершите предыдущий модуль, чтобы открыть задачи.
                    </p>
                  ) : null}
                  {completedLessons.length > 0 ? (
                    <details className="mt-2 max-w-lg">
                      <summary className="min-h-9 cursor-pointer py-2 text-sm font-medium text-[var(--muted)] underline decoration-[var(--line)] underline-offset-4 hover:text-[var(--ink)]">
                        Пройденные уроки · {completedLessons.length}
                      </summary>
                      <ol className="ml-2 border-l border-[var(--line)] py-1 pl-4">
                        {completedLessons.map((lesson) => (
                          <li key={lesson.id}>
                            <Link
                              className="inline-flex min-h-9 items-center text-sm text-[var(--accent)] underline underline-offset-4"
                              href={`/modules/${courseModule.id}/tasks/${lesson.slug}`}
                            >
                              {lesson.id} · {lesson.title}
                            </Link>
                          </li>
                        ))}
                      </ol>
                    </details>
                  ) : null}
                </div>
                <p className="text-sm tabular-nums text-[var(--muted)]">
                  {completedCount} / {courseModule.taskCount} задач
                </p>
                <div className="flex items-center gap-3">
                  <div
                    aria-label={`${modulePercent}% модуля выполнено`}
                    className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#dce3de]"
                    role="img"
                  >
                    <div
                      className="h-full rounded-full bg-[var(--accent)]"
                      style={{ width: `${modulePercent}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-xs tabular-nums text-[var(--muted)]">
                    {modulePercent}%
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="mt-8 border-t border-[var(--line)] pt-6">
        <p className="text-xs font-semibold uppercase text-[var(--muted)]">
          Финал курса
        </p>
        <h2 className="mt-2 font-semibold">Модуль 10 · Wrap-up &amp; Celebration</h2>
        <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
          Итоговый чек-лист проекта и подготовка результата для портфолио.
        </p>
      </section>
    </main>
  );
}