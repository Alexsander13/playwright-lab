export default function HomePage() {
  return (
    <main className="mx-auto min-h-[calc(100svh-4rem)] max-w-6xl px-6 py-16">
      <p className="text-sm font-medium text-[var(--accent)]">Платформа курса</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight">Playwright Lab</h1>
      <p className="mt-3 max-w-xl text-base leading-7 text-[var(--muted)]">
        Каркас веб-платформы готов. Далее подключим авторизацию и прогресс обучения.
      </p>
    </main>
  );
}