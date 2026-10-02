import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { CompleteTaskForm } from "@/components/complete-task-form";
import { LessonCodeSnippet } from "@/components/lesson-code-snippet";
import { SolutionAccordion } from "@/components/solution-accordion";
import { courseTasks, getCourseTask } from "@/lib/course-tasks";
import { getModuleGitCheckpoint } from "@/lib/module-git-checkpoints";
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
  const nextTask = courseTasks[taskIndex + 1];
  const moduleGitCheckpoint =
    !nextTask || nextTask.moduleId !== task.moduleId
      ? getModuleGitCheckpoint(task.moduleId)
      : undefined;
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
  const firstIncompletePreviousTask = progressError
    ? undefined
    : courseTasks.slice(0, taskIndex).find(
        (candidate) =>
          progressByTask.get(`${candidate.moduleId}:${candidate.id}`)
            ?.is_completed !== true,
      );

  if (firstIncompletePreviousTask) {
    redirect(
      `/modules/${firstIncompletePreviousTask.moduleId}/tasks/${firstIncompletePreviousTask.slug}`,
    );
  }

  const canComplete = !progressError;
  const completedAt = currentProgress?.completed_at;

  return (
    <main className="mx-auto min-h-[calc(100svh-4rem)] max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
      <Link
        className="inline-flex min-h-11 items-center text-base font-semibold text-[var(--accent)] underline underline-offset-4"
        href="/dashboard"
      >
        Назад к программе
      </Link>

      <header className="mt-5 rounded-3xl border border-[#d6e3da] bg-[linear-gradient(135deg,#ffffff_0%,#eff8f1_100%)] px-6 py-8 shadow-sm sm:mt-7 sm:px-9 sm:py-10">
        <p className="text-base font-semibold text-[var(--accent)]">
          Модуль {task.moduleId} · Задача {task.id}
        </p>
        <h1 className="mt-3 max-w-4xl text-3xl font-bold tracking-tight sm:text-5xl sm:leading-tight">
          {task.title}
        </h1>
        <div className="mt-6 max-w-3xl rounded-2xl border border-[#d5e6d9] bg-white/85 p-5">
          <p className="text-lg leading-8 text-[var(--ink)]">
            {task.summary}
          </p>
        </div>
      </header>

      <div className="mt-6 space-y-5 sm:mt-8 sm:space-y-6">
        {task.reuseHint ? (
          <section className="rounded-2xl border border-[#d5e0ed] bg-[#f5f8fc] p-5 sm:px-8 sm:py-6">
            <p className="text-sm font-bold uppercase tracking-wide text-[#385f85]">Что уже можно переиспользовать</p>
            <p className="mt-2 text-base leading-7 text-[var(--muted)]">{task.reuseHint}</p>
          </section>
        ) : null}
        {task.video ? (
          <section className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-sm">
            <div className="overflow-hidden rounded-xl border border-[var(--line)] bg-white shadow-sm">
              <div className="border-b border-[var(--line)] px-5 py-4 sm:px-6">
                <p className="text-sm font-semibold text-[var(--accent)]">
                  Дополнительный материал
                </p>
                <h2 className="mt-1 text-lg font-semibold">{task.video.title}</h2>
                <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                  {task.video.description}
                </p>
              </div>
              <video
                aria-label={task.video.title}
                className="aspect-video w-full bg-[#202522]"
                controls
                playsInline
                preload="metadata"
              >
                <source src={task.video.src} type="video/mp4" />
                Ваш браузер не поддерживает встроенное видео. Откройте файл по ссылке: {" "}
                <a className="underline" href={task.video.src}>
                  {task.video.title}
                </a>
                .
              </video>
            </div>
          </section>
        ) : null}

        <section className="rounded-2xl border border-[#d9e5dc] bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-bold uppercase tracking-wide text-[var(--accent)]">Зачем это нужно</p>
          <p className="mt-3 max-w-3xl text-lg leading-8 text-[var(--muted)]">
            {task.context}
          </p>
        </section>

        {task.terms?.length ? (
          <section className="rounded-2xl border border-[#d7e5db] bg-[#edf7ef] p-6 sm:p-8">
            <h2 className="text-2xl font-bold">Мини-словарь</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {task.terms.map((term) => (
                <article className="rounded-xl border border-[#cddfd2] bg-white p-5" key={term.term}>
                  <h3 className="text-lg font-bold">{term.term}</h3>
                  <p className="mt-2 text-base leading-7 text-[var(--muted)]">{term.definition}</p>
                  {term.analogy ? (
                    <p className="mt-3 border-l-2 border-[var(--accent)] pl-3 text-sm leading-6 text-[#35624c]">
                      <span className="font-semibold">Представьте: </span>{term.analogy}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className="rounded-2xl border border-[#d9e5dc] bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold">Главное перед практикой</h2>
          <ul className="mt-5 grid gap-3 text-base leading-7 text-[var(--muted)]">
            {task.theory.map((item) => (
              <li className="rounded-xl bg-[#f7faf7] px-4 py-3" key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-[#d9e5dc] bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold">Шаг за шагом</h2>
          <ol className="mt-6 space-y-4">
            {task.steps.map((step, index) => {
              const instruction = typeof step === "string" ? step : step.instruction;
              const snippets = typeof step === "string" ? [] : step.snippets ?? [];

              return (
              <li className="flex gap-4" key={instruction}>
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-bold text-white">{index + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="pt-0.5 text-base leading-7 text-[var(--muted)]">{instruction.replace(/^Шаг \d+\. /, "")}</p>
                  {snippets.map((snippet) => <LessonCodeSnippet key={`${snippet.file}:${snippet.code}`} snippet={snippet} />)}
                </div>
              </li>
              );
            })}
          </ol>
          {task.externalLink ? (
            <a
              className="mt-6 inline-flex min-h-11 items-center rounded-xl border border-[var(--line)] bg-white px-5 text-base font-semibold transition hover:border-[var(--accent)]"
              href={task.externalLink.href}
              rel="noreferrer"
              target="_blank"
            >
              {task.externalLink.label}
            </a>
          ) : null}
          {task.downloadPath ? (
            <a
              className="mt-6 inline-flex min-h-11 items-center rounded-xl border border-[var(--line)] bg-white px-5 text-base font-semibold transition hover:border-[var(--accent)]"
              download="demo-0.1.mjs"
              href={task.downloadPath}
            >
              Скачать демо-скрипт
            </a>
          ) : null}
          {task.commandGroups?.map((group) => (
            <div
              className="mt-6 rounded-xl border border-[#d4e1d7] bg-[#f7faf7] p-5"
              key={group.title}
            >
              <h3 className="text-lg font-bold">{group.title}</h3>
              <p className="mt-2 text-base leading-7 text-[var(--muted)]">
                {group.description}
              </p>
              <div className="mt-3 space-y-2">
                {group.commands.map((command) => (
                  <pre
                    className="overflow-x-auto rounded-lg bg-[#18231e] p-4 text-sm leading-6 text-white"
                    key={command}
                  >
                    <code>{command}</code>
                  </pre>
                ))}
              </div>
            </div>
          ))}
          {task.commands?.map((command) => (
            <pre
              className="mt-5 overflow-x-auto rounded-lg bg-[#18231e] p-4 text-sm leading-6 text-white"
              key={command}
            >
              <code>{command}</code>
            </pre>
          ))}
        </section>

        <section className="rounded-2xl border border-[#d9e5dc] bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold">Файлы урока</h2>
          <ul className="mt-5 space-y-3 text-base leading-7 text-[var(--muted)]">
            {task.files.map((file) => (
              <li className="rounded-lg bg-[#f7faf7] px-4 py-3 font-mono text-sm" key={file}>{file}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-[#bddac5] bg-[#f0f8f2] p-6 sm:p-8">
          <p className="text-sm font-bold uppercase tracking-wide text-[var(--accent)]">Проверьте себя</p>
          <h2 className="mt-2 text-2xl font-bold">Готово, когда</h2>
          <ul className="mt-5 space-y-3 text-base leading-7 text-[var(--muted)]">
            {task.definitionOfDone.map((criterion) => (
              <li className="flex gap-3" key={criterion}><span className="font-bold text-[var(--accent)]">✓</span><span>{criterion}</span></li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-[#e7d8b6] bg-[#fffaf0] p-6 sm:p-8">
          <p className="text-sm font-bold uppercase tracking-wide text-[#8a6323]">Типичные затруднения</p>
          <h2 className="mt-2 text-2xl font-bold">Подсказки, не раскрывающие ответ сразу</h2>
          <div className="mt-5 divide-y divide-[#e7d8b6] border-y border-[#e7d8b6]">
            {task.hints.map((hint, index) => (
              <details className="py-4" key={hint}>
                <summary className="cursor-pointer text-base font-semibold">
                  Уровень {index + 1}
                </summary>
                <p className="mt-3 text-base leading-7 text-[var(--muted)]">
                  {hint}
                </p>
              </details>
            ))}
          </div>
        </section>

        {task.solutionExamples?.length ? <SolutionAccordion examples={task.solutionExamples} /> : null}

        {moduleGitCheckpoint ? (
          <section>
            <div className="rounded-2xl border border-[#d6e3da] bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-bold uppercase tracking-wide text-[var(--accent)]">Финальный шаг модуля</p>
              <h2 className="mt-2 text-2xl font-bold">{moduleGitCheckpoint.title}</h2>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--muted)]">
                {moduleGitCheckpoint.description}
              </p>
              <ol className="mt-5 list-decimal space-y-3 pl-5 text-base leading-7 text-[var(--muted)]">
                <li>Выполните git status и спокойно прочитайте список изменений.</li>
                <li>Убедитесь, что в нём нет .env, паролей, токенов или других личных файлов.</li>
                <li>Добавьте все изменения модуля, затем ещё раз проверьте будущий коммит.</li>
              </ol>
              <div className="mt-4 space-y-2">
                <pre className="overflow-x-auto rounded-lg bg-[#18231e] p-4 text-sm leading-6 text-white">
                  <code>git status</code>
                </pre>
                <pre className="overflow-x-auto rounded-lg bg-[#18231e] p-4 text-sm leading-6 text-white">
                  <code>git add -A</code>
                </pre>
                <pre className="overflow-x-auto rounded-lg bg-[#18231e] p-4 text-sm leading-6 text-white">
                  <code>git diff --staged</code>
                </pre>
                <pre className="overflow-x-auto rounded-lg bg-[#18231e] p-4 text-sm leading-6 text-white">
                  <code>{`git commit -m "${moduleGitCheckpoint.commitMessage}"`}</code>
                </pre>
              </div>
            </div>
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
        {nextTask && isCompleted ? (
          <Link
            className="text-sm font-medium text-[var(--accent)] underline underline-offset-4"
            href={`/modules/${nextTask.moduleId}/tasks/${nextTask.slug}`}
          >
            Следующая задача: {nextTask.id}
          </Link>
        ) : nextTask ? (
          <p className="text-sm text-[var(--muted)]">
            Завершите текущую задачу, чтобы открыть следующую.
          </p>
        ) : null}
      </footer>
    </main>
  );
}
