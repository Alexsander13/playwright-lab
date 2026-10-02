import { expect, test } from "@playwright/test";

test("аудит стенда: Notes App регистрирует и авторизует изолированного пользователя", async ({ page, request }) => {
  const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const user = {
    // Поле name на стенде допускает только буквы и пробелы.
    name: "Audit User",
    email: `audit-ui-${suffix}@example.test`,
    password: "safe-test-password",
  };
  let token: string | undefined;
  let registrationSubmitted = false;
  const noteTitle = `Audit UI note ${suffix}`;

  try {
    await page.goto("/notes/app");
    await expect(page.getByRole("link", { name: "Login" })).toBeVisible();

    await page.goto("/notes/app/register");
    await page.getByTestId("register-email").fill(user.email);
    await page.getByTestId("register-name").fill(user.name);
    await page.getByTestId("register-password").fill(user.password);
    await page.getByTestId("register-confirm-password").fill(user.password);
    await page.getByTestId("register-submit").click();
    registrationSubmitted = true;

    await expect(page.getByText("User account created successfully")).toBeVisible();
    await page.getByRole("link", { name: "Click here to Log In" }).click();
    await expect(page).toHaveURL(/\/notes\/app\/login$/);
    await expect(page.getByTestId("login-submit")).toBeVisible();
    await expect(page.getByTestId("login-submit")).toBeEnabled();

    await page.getByTestId("login-email").fill(user.email);
    await page.getByTestId("login-password").fill(user.password);
    await page.getByTestId("login-submit").click();

    await expect(page).toHaveURL(/\/notes\/app$/);
    await expect(page.getByRole("button", { name: "+ Add Note" })).toBeVisible();

    const login = await request.post("/notes/api/users/login", { data: user });
    expect(login.ok()).toBeTruthy();
    token = (await login.json()).data.token as string;
    const headers = { "x-auth-token": token };

    await page.getByTestId("add-new-note").click();
    await page.getByTestId("note-title").fill(noteTitle);
    await page.getByTestId("note-description").fill("Заметка из безопасного smoke-аудита");
    await page.getByTestId("note-category").selectOption("Work");
    await page.getByTestId("note-submit").click();
    await expect(page.getByText(noteTitle, { exact: true })).toBeVisible();

    const notesAfterUiCreate = await request.get("/notes/api/notes", { headers });
    expect(notesAfterUiCreate.ok()).toBeTruthy();
    expect((await notesAfterUiCreate.json()).data.some((note: { title: string }) => note.title === noteTitle)).toBe(true);

    await page.getByTestId("toggle-note-switch").check();
    await expect(page.getByTestId("toggle-note-switch")).toBeChecked();

    const updatedTitle = `${noteTitle} updated`;
    await page.getByTestId("note-edit").click();
    await page.getByTestId("note-title").fill(updatedTitle);
    await page.getByTestId("note-submit").click();
    await expect(page.getByText(updatedTitle, { exact: true })).toBeVisible();
    await expect(page.getByText(noteTitle, { exact: true })).not.toBeVisible();

    await page.getByTestId("search-input").fill(updatedTitle);
    await page.getByTestId("search-btn").click();
    await expect(page.getByText(updatedTitle, { exact: true })).toBeVisible();

    await page.getByTestId("search-input").fill(`missing-${suffix}`);
    await page.getByTestId("search-btn").click();
    await expect(page.getByRole("heading", { name: "Couldn't find any notes in all categories" })).toBeVisible();

    await page.getByTestId("search-input").fill("");
    await page.getByTestId("search-btn").click();
    await page.getByTestId("note-delete").click();
    await page.getByTestId("note-delete-confirm").click();
    await expect(page.getByTestId("note-card-title")).not.toBeVisible();

    const apiTitle = `Audit API note ${suffix}`;
    const apiCreate = await request.post("/notes/api/notes", {
      headers,
      data: { title: apiTitle, description: "Заметка из API для UI-проверки", category: "Work" },
    });
    expect(apiCreate.status()).toBe(200);
    await page.reload();
    await expect(page.getByText(apiTitle, { exact: true })).toBeVisible();
  } finally {
    if (!token && registrationSubmitted) {
      const login = await request.post("/notes/api/users/login", { data: user });
      if (login.ok()) token = (await login.json()).data.token as string;
    }
    if (token) {
      const deletion = await request.delete("/notes/api/users/delete-account", {
        headers: { "x-auth-token": token },
      });
      expect(deletion.ok()).toBeTruthy();
    }
  }
});
