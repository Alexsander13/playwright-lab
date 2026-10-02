"use client";

import { useState } from "react";

import type { LessonCodeSnippet as LessonCodeSnippetData } from "@/lib/module-zero";

type LessonCodeSnippetProps = {
  snippet: LessonCodeSnippetData;
};

export function LessonCodeSnippet({ snippet }: LessonCodeSnippetProps) {
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    await navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-[#cde1d4] bg-white text-left shadow-sm">
      <div className="flex items-center justify-between gap-3 border-l-4 border-[#21a66f] bg-[#f6fbf7] px-4 py-3">
        <div>
          <p className="font-mono text-sm font-semibold text-[#1d4230]">{snippet.file}</p>
          <p className="mt-1 text-sm leading-5 text-[var(--muted)]">{snippet.description}</p>
        </div>
        <button
          className="shrink-0 rounded-lg border border-[#b9d7c3] bg-white px-3 py-2 text-sm font-semibold text-[#216342] transition hover:bg-[#eaf6ee]"
          onClick={copyCode}
          type="button"
        >
          {copied ? "Скопировано" : "Скопировать"}
        </button>
      </div>
      <pre className="overflow-x-auto border-l-4 border-[#21a66f] bg-[#fbfdfb] p-5 font-mono text-[15px] leading-7 text-[#17221b]">
        <code>{snippet.code}</code>
      </pre>
    </div>
  );
}
