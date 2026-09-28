import { defineConfig } from "@playwright/test";

import { BASE_URL } from "./src/config/env";

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: BASE_URL,
  },
});