import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { CompleteTaskForm } from "@/components/complete-task-form";
import { courseTasks, getCourseTask } from "@/lib/course-tasks";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type TaskPageProps = {
  params: Promise<{ moduleId: string; slug: string }>;
};

export default async function CourseTaskPage({ params }: TaskPageProps) {
  const { moduleId, slug } = await params;
  const task = getCourseTask(moduleId, slug);

  if (!task) {
    notFound();
  }

  const taskIndex = courseTasks.findIndex(
    (candidate) =>
      candidate.moduleId === task.moduleId && candidate.id === task.id,
  );
  const previousTask = courseTasks[taskIndex - 1];
  const nextTask = courseTasks[taskIndex + 1];
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/auth/sign-in?next=${encodeURIComponent(`/modules/${moduleId}/tasks/${slug}`)}`,
    );
  }

  const { data: progressRows, error: progressError } = await supabase
    .from("user_progress")
    .select("module_id, task_id, is_completed, completed_at");
  const progressByTask = new Map(
    (progressRows ?? []).map((row) => [
      `${row.module_id}:${row.task_id}`,
      row,
    ]),
  );
  const currentProgress = progressByTask.get(`${task.moduleId}:${task.id}`);
  const isCompleted = currentProgress?.is_completed === true;
  const previousTaskCompleted = previousTask
    ? progressByTask.get(`${previousTask.moduleId}:${previousTask.id}`)
        ?.is_completed === true
    : true;
  const canComplete = previousTaskCompleted && !progressError;
  const completedAt = currentProgress?.completed_at;

  return (
    <main className="mx-auto min-h-[calc(100svh-4rem)] max-w-4xl px-6 py-10 sm:py-14">
      <Link
        className="text-sm font-medium text-[var(--accent)] underline underline-offset-4"
        href="/dashboard"
      >
        Назад к программе
      </Link>

      <header className="mt-8 border-b border-[var(--line)] pb-7">
        <p className="text-sm font-medium text-[var(--accent)]">
          Модуль {task.moduleId} · Задача {task.id}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          {task.title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">
          {task.summary}
        </p>
      </header>

      <div className="divide-y divide-[var(--line)]">
        <section className="py-7">
          <h2 className="text-lg font-semibold">Контекст и проблема</h2>
          <p className="mt-3 max-w-2xl leading-7 text-[var(--muted)]">
            {task.context}
          </p>
        </section>

        <section className="py-7">
          <h2 className="text-lg font-semibold">Короткая теория</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted)]">
            {task.theory.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="py-7">
          <h2 className="text-lg font-semibold">Что сделать</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-6 text-[var(--muted)]">
            {task.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          {task.externalLink ? (
            <a
              className="mt-5 inline-flex min-h-10 items-center rounded-md border border-[var(--line)] bg-white px-4 text-sm font-medium transition hover:border-[var(--accent)]"
              href={task.externalLink.href}
              rel="noreferrer"
              target="_blank"
            >
              {task.externalLink.label}
            </a>
          ) : null}
          {task.downloadPath ? (
            <a
              className="mt-5 inline-flex min-h-10 items-center rounded-md border border-[var(--line)] bg-white px-4 text-sm font-medium transition hover:border-[var(--accent)]"
              download="demo-0.1.mjs"
              href={task.downloadPath}
            >
              Скачать демо-скрипт
            </a>
          ) : null}
          {task.commands?.map((command) => (
            <pre
              className="mt-4 overflow-x-auto rounded-md bg-[#202522] p-4 text-sm text-white"
              key={command}
            >
              <code>{command}</code>
            </pre>
          ))}
        </section>

        <section className="py-7">
          <h2 className="text-lg font-semibold">Файлы и ожидаемые изменения</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted)]">
            {task.files.map((file) => (
              <li key={file}>{file}</li>
            ))}
          </ul>
        </section>

        <section className="py-7">
          <h2 className="text-lg font-semibold">Definition of Done</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted)]">
            {task.definitionOfDone.map((criterion) => (
              <li key={criterion}>{criterion}</li>
            ))}
          </ul>
        </section>

        <section className="py-7">
          <h2 className="text-lg font-semibold">Подсказки</h2>
          <div className="mt-4 divide-y divide-[var(--line)] border-y border-[var(--line)]">
            {task.hints.map((hint, index) => (
              <details className="py-3" key={hint}>
                <summary className="cursor-pointer text-sm font-medium">
                  Уровень {index + 1}
                </summary>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  {hint}
                </p>
              </details>
            ))}
          </div>
        </section>

        {task.checkpoint ? (
          <section className="py-7">
            <h2 className="text-lg font-semibold">Git-чекпоинт</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              {task.checkpoint}
            </p>
          </section>
        ) : null}
      </div>

      {progressError ? (
        <p className="mt-6 border-l-2 border-red-600 pl-3 text-sm text-red-800" role="alert">
          Не удалось загрузить прогресс. Обновите страницу чуть позже.
        </p>
      ) : null}
      <footer className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] pt-6">
        <div>
          {isCompleted ? (
            <p className="text-sm font-medium text-[var(--accent)]">
              Задача выполнена
              {completedAt
                ? ` · ${new Intl.DateTimeFormat("ru", {
                    dateStyle: "medium",
                  }).format(new Date(completedAt))}`
                : ""}
            </p>
          ) : canComplete ? (
            <CompleteTaskForm
              moduleId={task.moduleId}
              slug={task.slug}
              taskId={task.id}
            />
          ) : (
            <p className="text-sm text-[var(--muted)]">
              Завершите предыдущую задачу, чтобы открыть отметку выполнения.
            </p>
          )}
        </div>
        {nextTask ? (
          <Link
            className="text-sm font-medium text-[var(--accent)] underline underline-offset-4"
            href={`/modules/${nextTask.moduleId}/tasks/${nextTask.slug}`}
          >
            Следующая задача: {nextTask.id}
          </Link>
        ) : null}
      </footer>
    </main>
  );
}