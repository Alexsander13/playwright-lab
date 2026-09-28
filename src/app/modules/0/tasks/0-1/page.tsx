import Link from "next/link";
import { redirect } from "next/navigation";

import { completeIntroTaskAction } from "@/app/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type IntroTaskPageProps = {
  searchParams: Promise<{ completed?: string; saveError?: string }>;
};

export default async function IntroTaskPage({
  searchParams,
}: IntroTaskPageProps) {
  const { completed, saveError } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in?next=%2Fmodules%2F0%2Ftasks%2F0-1");
  }

  const { data: progress, error: progressError } = await supabase
    .from("user_progress")
    .select("is_completed, completed_at")
    .eq("module_id", "0")
    .eq("task_id", "0.1")
    .maybeSingle();
  const isCompleted = progress?.is_completed === true;

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
          Модуль 0 · Задача 0.1
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Первый запуск автоматизации
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">
          Сначала увидьте результат: готовый сценарий сам откроет браузер,
          выполнит короткую проверку и завершится успешным статусом.
        </p>
      </header>

      <div className="divide-y divide-[var(--line)]">
        <section className="py-7">
          <h2 className="text-lg font-semibold">Контекст</h2>
          <p className="mt-3 max-w-2xl leading-7 text-[var(--muted)]">
            До установки окружения и изучения конфигурации важно увидеть, к
            какому результату ведёт курс. В этой вводной задаче используется
            готовый мини-сценарий, чтобы отделить цель автоматизации от деталей
            настройки проекта.
          </p>
        </section>

        <section className="py-7">
          <h2 className="text-lg font-semibold">Запуск</h2>
          <p className="mt-3 max-w-2xl leading-7 text-[var(--muted)]">
            Скачайте готовый файл и сохраните его как
            <code className="mx-1 rounded bg-white px-1.5 py-0.5 text-sm text-[var(--ink)]">
              demo-0.1.mjs
            </code>
            в отдельную папку.
          </p>
          <a
            className="mt-4 inline-flex min-h-10 items-center rounded-md border border-[var(--line)] bg-white px-4 text-sm font-medium transition hover:border-[var(--accent)]"
            download="demo-0.1.mjs"
            href="/demos/demo-0.1.mjs"
          >
            Скачать демо-скрипт
          </a>
          <p className="mt-6 max-w-2xl leading-7 text-[var(--muted)]">
            Если Chromium ещё не установлен, выполните это один раз:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-md bg-[#202522] p-4 text-sm text-white">
            <code>npx --yes --package=playwright playwright install chromium</code>
          </pre>
          <p className="mt-4 max-w-2xl leading-7 text-[var(--muted)]">
            Затем из папки со скриптом запустите одну команду:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-md bg-[#202522] p-4 text-sm text-white">
            <code>npx --yes --package=playwright --call &quot;node demo-0.1.mjs&quot;</code>
          </pre>
        </section>

        <section className="py-7">
          <h2 className="text-lg font-semibold">Критерии готовности</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted)]">
            <li>Браузер открылся и выполнил демонстрационный сценарий.</li>
            <li>Сценарий завершился без ошибки, браузер закрылся.</li>
            <li>В терминале появился успешный статус выполнения.</li>
          </ul>
        </section>

        <section className="py-7">
          <h2 className="text-lg font-semibold">Результат</h2>
          <p className="mt-3 max-w-2xl leading-7 text-[var(--muted)]">
            Это ознакомительный шаг. Коммит не требуется; дальше по программе
            идут создание репозитория, установка Playwright и первый собственный
            smoke-тест.
          </p>
        </section>
      </div>

      {progressError ? (
        <p className="mt-6 border-l-2 border-red-600 pl-3 text-sm text-red-800" role="alert">
          Не удалось загрузить статус задачи. Обновите страницу чуть позже.
        </p>
      ) : null}
      {saveError ? (
        <p className="mt-6 border-l-2 border-red-600 pl-3 text-sm text-red-800" role="alert">
          Не удалось сохранить выполнение. Попробуйте ещё раз.
        </p>
      ) : null}
      {completed ? (
        <p className="mt-6 border-l-2 border-[var(--accent)] pl-3 text-sm font-medium text-[var(--accent)]" role="status">
          Задача 0.1 отмечена как выполненная.
        </p>
      ) : null}

      <footer className="mt-8 border-t border-[var(--line)] pt-6">
        {isCompleted ? (
          <p className="text-sm font-medium text-[var(--accent)]">
            Задача выполнена
            {progress.completed_at
              ? ` · ${new Intl.DateTimeFormat("ru", {
                  dateStyle: "medium",
                }).format(new Date(progress.completed_at))}`
              : ""}
          </p>
        ) : (
          <form action={completeIntroTaskAction}>
            <button
              className="min-h-11 rounded-md bg-[var(--accent)] px-5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={Boolean(progressError)}
              type="submit"
            >
              Отметить задачу выполненной
            </button>
          </form>
        )}
      </footer>
    </main>
  );
}