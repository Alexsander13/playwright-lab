import { redirect } from "next/navigation";

type HomePageProps = {
  searchParams: Promise<{ authError?: string; code?: string }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const { authError, code } = await searchParams;

  if (code) {
    redirect(`/auth/callback?code=${encodeURIComponent(code)}&next=%2F`);
  }

  return (
    <main className="mx-auto min-h-[calc(100svh-4rem)] max-w-6xl px-6 py-16 sm:py-24">
      <section className="max-w-3xl">
        <p className="text-sm font-medium text-[var(--accent)]">
          Практический курс по автоматизации тестирования
        </p>
        <h1 className="mt-5 max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Осваивайте Playwright на задачах, близких к настоящей работе.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--muted)]">
          Последовательно создавайте проект автотестов на TypeScript: от первого
          UI-сценария до запуска проверок в CI.
        </p>
        {authError ? (
          <p
            className="mt-8 border-l-2 border-red-600 pl-3 text-sm text-red-800"
            role="alert"
          >
            Не удалось выполнить вход через GitHub. Попробуйте ещё раз.
          </p>
        ) : null}
      </section>
    </main>
  );
}