import { chromium } from "playwright";

import { BASE_URL } from "../src/config/env";

const success = "\u001b[32m";
const reset = "\u001b[0m";

async function runDemo() {
  const browser = await chromium.launch({ headless: false });

  try {
    const page = await browser.newPage();
    await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });

    const heading = page.getByRole("heading").first();
    await heading.waitFor({ state: "visible" });

    const title = await page.title();
    if (!title) {
      throw new Error("Открытая страница не содержит заголовок документа.");
    }

    console.log(`${success}✓ Демонстрационный сценарий выполнен${reset}`);
    console.log(`Страница: ${title}`);
  } finally {
    await browser.close();
  }
}

runDemo().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Неизвестная ошибка";
  console.error(`\u001b[31m✗ Демо не выполнено: ${message}\u001b[0m`);
  process.exitCode = 1;
});