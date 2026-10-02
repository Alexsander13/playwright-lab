import type { CodeExample } from "@/lib/module-zero";

type SolutionAccordionProps = {
  examples: CodeExample[];
};

export function SolutionAccordion({ examples }: SolutionAccordionProps) {
  return (
    <details className="group overflow-hidden rounded-2xl border border-[#c7d9cf] bg-[#f1f8f3] shadow-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-base font-semibold text-[#174b35] marker:content-none sm:px-6">
        <span>Посмотреть эталонный шаблон теста</span>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--accent)] group-open:hidden">
          Открыть
        </span>
        <span className="hidden rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--accent)] group-open:inline">
          Скрыть
        </span>
      </summary>
      <div className="border-t border-[#c7d9cf] bg-white p-5 sm:p-6">
        <p className="max-w-2xl text-base leading-7 text-[var(--muted)]">
          Сначала попробуйте сделать шаги сами. Здесь — полный шаблон теста: все места поиска элемента специально отмечены, чтобы вы нашли локатор в Inspector самостоятельно.
        </p>
        <div className="mt-5 space-y-5">
          {examples.map((example) => (
            <article className="overflow-hidden rounded-xl border border-[var(--line)]" key={example.title}>
              <header className="flex items-start justify-between gap-4 bg-[#fbfcfa] px-4 py-3">
                <div>
                  <h3 className="font-mono text-sm font-semibold text-[var(--ink)]">{example.title}</h3>
                  {example.description ? (
                    <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{example.description}</p>
                  ) : null}
                </div>
                <span className="shrink-0 rounded bg-[#e9f2ec] px-2 py-1 text-xs font-semibold uppercase tracking-wide text-[#35624c]">
                  {example.language}
                </span>
              </header>
              <pre className="overflow-x-auto bg-[#18231e] p-4 text-sm leading-6 text-[#f4faf6] sm:p-5">
                <code>{example.code}</code>
              </pre>
            </article>
          ))}
        </div>
      </div>
    </details>
  );
}
