import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/audit",
  timeout: 30_000,
  // Внешний учебный стенд может нестабильно отвечать на параллельные браузерные сценарии.
  workers: 1,
  use: {
    baseURL: "https://practice.expandtesting.com",
    trace: "retain-on-failure",
  },
});
