const DEFAULT_BASE_URL = "https://practice.expandtesting.com";

export const BASE_URL = new URL(
  process.env.BASE_URL ?? DEFAULT_BASE_URL,
).toString().replace(/\/$/, "");

export const NOTES_API_URL = new URL(
  process.env.NOTES_API_URL ?? "/notes/api",
  `${BASE_URL}/`,
).toString().replace(/\/$/, "");