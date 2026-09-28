import { expect, test } from "@playwright/test";

test("Expand Testing homepage loads", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Automation Testing Practice Website/);
});