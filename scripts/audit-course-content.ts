import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { courseTasks } from "../src/lib/course-tasks";
import { createCourseAuditRegistry } from "../src/lib/course-audit-manifest";

const sourceRoot = join(process.cwd(), "src", "lib");
const prohibitedPatterns = [
  { pattern: /page\.click\s*\(/, label: "page.click()" },
  { pattern: /page\.waitForTimeout\s*\(/, label: "page.waitForTimeout()" },
  { pattern: /xpath=/i, label: "XPath" },
  { pattern: /page\.goto\s*\(\s*["'`]https:\/\//, label: "полный URL в page.goto()" },
];

async function sourceFiles(directory: string): Promise<string[]> {
  const files = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(files.map(async (file) => {
    const path = join(directory, file.name);
    return file.isDirectory()
      ? sourceFiles(path)
      : file.name.endsWith(".ts") ? [path] : [];
  }));
  return nested.flat();
}

async function main() {
  const registry = createCourseAuditRegistry(courseTasks);
  const errors: string[] = [];

  if (courseTasks.length !== 70) errors.push(`Ожидалось 70 уроков, найдено ${courseTasks.length}.`);
  if (registry.length !== courseTasks.length) errors.push("Реестр аудита не покрывает все уроки.");

  for (const card of registry) {
    if (!card.learningGoal || !card.keyAssertion || !card.status) {
      errors.push(`${card.lessonId}: не заполнена обязательная карточка аудита.`);
    }
    if (card.status === "external_exception" && !card.exceptionReason) {
      errors.push(`${card.lessonId}: для внешнего исключения не указана причина.`);
    }
    if (card.status !== "external_exception" && !card.url) {
      errors.push(`${card.lessonId}: отсутствует URL стенда.`);
    }
  }

  const firstUiTest = courseTasks.find(({ id }) => id === "1.1");
  const firstUiCode = firstUiTest?.solutionExamples?.map(({ code }) => code).join("\n") ?? "";
  const firstUiText = [firstUiTest?.summary, ...(firstUiTest?.theory ?? []), ...(firstUiTest?.steps ?? [])]
    .map((value) => typeof value === "string" ? value : value?.instruction ?? "")
    .join("\n");
  for (const expected of ["Web inputs"]) {
    if (!firstUiText.includes(expected)) {
      errors.push(`1.1: текст должен объяснять цель поиска ${expected}.`);
    }
  }
  for (const expected of ["getByRole", "toBeVisible", "ВСТАВЬТЕ ДОСТУПНОЕ ИМЯ РЕАЛЬНОГО ЭЛЕМЕНТА"]) {
    if (!firstUiCode.includes(expected)) {
      errors.push(`1.1: шаблон решения должен содержать ${expected}.`);
    }
  }
  if (!/page\.goto\(["']\/["']\)/.test(firstUiCode) || !firstUiText.includes("page.goto('/')")) {
    errors.push("1.1: код и текст должны использовать относительный путь к baseURL.");
  }

  for (const lesson of courseTasks) {
    const snippets = lesson.solutionExamples ?? [];
    for (const snippet of snippets) {
      if (snippet.code.includes("test(") && !snippet.code.includes("expect(")) {
        errors.push(`${lesson.id}: полный пример теста не содержит expect.`);
      }
    }
  }

  for (const file of await sourceFiles(sourceRoot)) {
    const source = await readFile(file, "utf8");
    for (const { pattern, label } of prohibitedPatterns) {
      if (pattern.test(source)) errors.push(`${file.replace(`${process.cwd()}/`, "")}: найден запрещённый паттерн ${label}.`);
    }
  }

  if (errors.length) throw new Error(`Аудит контента не пройден:\n- ${errors.join("\n- ")}`);
  console.log(`Аудит контента пройден: ${registry.length} уроков покрыты реестром, устаревшие паттерны не найдены.`);
}

await main();
