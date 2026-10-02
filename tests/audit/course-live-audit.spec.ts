import { expect, test } from "@playwright/test";
import { createCourseAuditRegistry } from "@/lib/course-audit-manifest";
import { courseTasks } from "@/lib/course-tasks";

const liveCards = createCourseAuditRegistry(courseTasks).filter(
  (card) => card.liveAssertion,
);

for (const card of liveCards) {
  test(`аудит стенда: урок ${card.lessonId} — ${card.lessonTitle}`, async ({ page, request }) => {
    const assertion = card.liveAssertion;
    if (!assertion) throw new Error(`Для ${card.lessonId} не задана live-проверка.`);

    if (assertion.kind === "api") {
      const response = await request.get(assertion.path);
      const body = await response.json() as Record<string, unknown>;
      expect(response.status()).toBe(assertion.expectedStatus);
      expect(body[assertion.expectedField]).toBe(true);
    } else if (assertion.kind === "role") {
      await page.goto(card.url ?? "/");
      await expect(page.getByRole(assertion.role, { name: assertion.name })).toBeVisible();
    } else if (assertion.kind === "label") {
      await page.goto(card.url ?? "/");
      await expect(page.getByLabel(assertion.name)).toBeVisible();
    } else if (assertion.kind === "testId") {
      await page.goto(card.url ?? "/");
      await expect(page.getByTestId(assertion.name)).toBeVisible();
    } else if (assertion.kind === "text") {
      await page.goto(card.url ?? "/");
      await expect(page.getByText(assertion.name, { exact: assertion.exact })).toBeVisible();
    } else {
      await page.goto(card.url ?? "/");
      await expect(page.locator(assertion.value)).toBeVisible();
    }
  });
}

test("аудит стенда: урок 1.1 выполняет современный сценарий целиком", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Web inputs" }).click();
  await expect(
    page.getByRole("heading", { name: "Web inputs page for Automation Testing Practice" }),
  ).toBeVisible();
});
