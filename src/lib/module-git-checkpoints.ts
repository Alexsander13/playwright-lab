export type ModuleGitCheckpoint = {
  title: string;
  description: string;
  commitMessage: string;
};

const moduleGitCheckpoints: Record<string, ModuleGitCheckpoint> = {
  "0": {
    title: "Сохраняем Модуль 0 в Git",
    description:
      "Вы настроили проект и написали первый smoke-тест. Сохраните результат одним понятным коммитом.",
    commitMessage: "feat(module-0): complete Playwright setup and first smoke test",
  },
  "1": {
    title: "Сохраняем Модуль 1 в Git",
    description:
      "Типы, тестовые данные и конфигурация окружения готовы. Сохраните весь результат модуля одним коммитом.",
    commitMessage: "feat(module-1): add typed test data and environment setup",
  },
  "2": {
    title: "Сохраняем Модуль 2 в Git",
    description:
      "Сценарии Notes App готовы. Проверьте изменения и сохраните их одним коммитом.",
    commitMessage: "feat(module-2): add reliable Notes App UI tests",
  },
  "3": {
    title: "Сохраняем Модуль 3 в Git",
    description:
      "API-тесты и очистка тестовых данных готовы. Сохраните результат модуля одним коммитом.",
    commitMessage: "feat(module-3): add Notes API test coverage",
  },
  "4": {
    title: "Сохраняем Модуль 4 в Git",
    description:
      "Сквозные UI и API сценарии готовы. Проверьте их и сохраните одним коммитом.",
    commitMessage: "feat(module-4): add UI and API end-to-end scenarios",
  },
  "5": {
    title: "Сохраняем Модуль 5 в Git",
    description:
      "Page Objects, fixtures и очистка данных готовы. Сохраните изменения одним коммитом.",
    commitMessage: "feat(module-5): add page objects and test fixtures",
  },
  "6": {
    title: "Сохраняем Модуль 6 в Git",
    description:
      "Лабораторные сценарии Playwright готовы. Сохраните весь результат одним коммитом.",
    commitMessage: "feat(module-6): add Playwright browser capability labs",
  },
  "7": {
    title: "Сохраняем Модуль 7 в Git",
    description:
      "Диагностика падений и параллельный запуск готовы. Сохраните изменения одним коммитом.",
    commitMessage: "feat(module-7): improve test diagnostics and parallelism",
  },
  "8": {
    title: "Сохраняем Модуль 8 в Git",
    description:
      "Отчёты и CI готовы. Проверьте workflow-файлы и сохраните модуль одним коммитом.",
    commitMessage: "feat(module-8): add reports and CI workflows",
  },
  "9": {
    title: "Сохраняем Модуль 9 в Git",
    description:
      "AI-инструменты и безопасный репортёр готовы. Перед коммитом ещё раз убедитесь, что секреты не попали в список файлов.",
    commitMessage: "feat(module-9): add safe AI-assisted test diagnostics",
  },
};

export function getModuleGitCheckpoint(moduleId: string) {
  return moduleGitCheckpoints[moduleId];
}
