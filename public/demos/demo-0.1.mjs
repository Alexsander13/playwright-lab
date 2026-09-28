import { existsSync, realpathSync } from "node:fs";
import { delimiter, dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const executableNames =
  process.platform === "win32"
    ? ["playwright.cmd", "playwright.exe", "playwright"]
    : ["playwright"];

function findPlaywrightEntry() {
  for (const directory of process.env.PATH.split(delimiter)) {
    for (const executableName of executableNames) {
      const executable = join(directory, executableName);
      if (!existsSync(executable)) {
        continue;
      }

      const resolvedExecutable = realpathSync(executable);
      const candidates = [
        join(dirname(resolvedExecutable), "index.mjs"),
        resolve(directory, "..", "playwright", "index.mjs"),
      ];
      const entry = candidates.find(existsSync);
      if (entry) {
        return entry;
      }
    }
  }

  throw new Error("Запустите файл командой npx --package=playwright.");
}

const { chromium } = await import(
  pathToFileURL(findPlaywrightEntry()).href
);
const baseURL = new URL(
  process.env.BASE_URL ?? "https://practice.expandtesting.com",
).toString();
const browser = await chromium.launch({ headless: false });

try {
  const page = await browser.newPage();
  await page.goto(baseURL, { waitUntil: "domcontentloaded" });
  await page.getByRole("heading").first().waitFor({ state: "visible" });

  const title = await page.title();
  if (!title) {
    throw new Error("Открытая страница не содержит заголовок документа.");
  }

  console.log("\u001b[32m✓ Демонстрационный сценарий выполнен\u001b[0m");
  console.log(`Страница: ${title}`);
} catch (error) {
  const message = error instanceof Error ? error.message : "Неизвестная ошибка";
  console.error(`\u001b[31m✗ Демо не выполнено: ${message}\u001b[0m`);
  process.exitCode = 1;
} finally {
  await browser.close();
}