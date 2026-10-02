import { expect, test } from "@playwright/test";

test("аудит стенда: Notes API поддерживает безопасный lifecycle тестовых данных", async ({ request }) => {
  const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const user = {
    // Notes API принимает в name только буквы и пробелы; уникальность нужна email.
    name: "Audit User",
    email: `audit-${suffix}@example.test`,
    password: "safe-test-password",
  };
  let token: string | undefined;
  let noteId: string | undefined;

  try {
    const register = await request.post("/notes/api/users/register", { data: user });
    expect(register.status()).toBe(201);
    expect((await register.json()).data.email).toBe(user.email);

    const login = await request.post("/notes/api/users/login", { data: user });
    expect(login.ok()).toBeTruthy();
    token = (await login.json()).data.token as string;
    expect(token).toBeTruthy();
    const headers = { "x-auth-token": token };

    const title = `Audit note ${suffix}`;
    const create = await request.post("/notes/api/notes", {
      headers,
      data: { title, description: "Проверка публичного Notes API", category: "Work" },
    });
    // Notes API создаёт заметку с HTTP 200 (пользователь — с 201).
    expect(create.status()).toBe(200);
    noteId = (await create.json()).data.id as string;
    expect(noteId).toBeTruthy();

    const read = await request.get(`/notes/api/notes/${noteId}`, { headers });
    expect(read.ok()).toBeTruthy();
    expect((await read.json()).data.title).toBe(title);

    const completed = await request.patch(`/notes/api/notes/${noteId}`, {
      headers,
      data: { completed: true },
    });
    expect(completed.ok()).toBeTruthy();
    expect((await completed.json()).data.completed).toBe(true);

    const updatedTitle = `${title} updated`;
    const update = await request.put(`/notes/api/notes/${noteId}`, {
      headers,
      data: {
        title: updatedTitle,
        description: "Обновлённая тестовая заметка",
        completed: true,
        category: "Work",
      },
    });
    expect(update.ok()).toBeTruthy();
    expect((await update.json()).data.title).toBe(updatedTitle);
  } finally {
    if (token && noteId) {
      const deletion = await request.delete(`/notes/api/notes/${noteId}`, {
        headers: { "x-auth-token": token },
      });
      expect(deletion.ok()).toBeTruthy();
    }
    if (token) {
      const deletion = await request.delete("/notes/api/users/delete-account", {
        headers: { "x-auth-token": token },
      });
      expect(deletion.ok()).toBeTruthy();
    }
  }
});
