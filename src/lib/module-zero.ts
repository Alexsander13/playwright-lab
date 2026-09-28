export type ModuleZeroTask = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  context: string;
  theory: string[];
  steps: string[];
  files: string[];
  definitionOfDone: string[];
  hints: [string, string, string];
  checkpoint?: string;
  downloadPath?: string;
  externalLink?: { href: string; label: string };
  commands?: string[];
};

export const moduleZeroTasks: ModuleZeroTask[] = [
  {
    id: "0.1",
    slug: "0-1",
    title: "Первый запуск автоматизации",
    summary: "Увидеть работающий браузерный сценарий до настройки проекта.",
    context:
      "До установки окружения и изучения конфигурации важно увидеть, к какому результату ведёт курс. Готовый сценарий отделяет цель автоматизации от деталей настройки.",
    theory: [
      "Сценарий управляет настоящим браузером и ждёт наблюдаемого состояния страницы.",
      "Успешный процесс завершается кодом 0; ошибка должна дать ненулевой exit code.",
    ],
    steps: [
      "Скачайте файл демо в отдельную пустую папку.",
      "Если Chromium ещё не установлен, скачайте браузерный бинарник командой ниже.",
      "Запустите сценарий и наблюдайте, как открывается и закрывается браузер.",
      "Сверьте зелёный статус и заголовок страницы в терминале.",
    ],
    files: ["demo-0.1.mjs — готовый вводный сценарий; менять его не нужно."],
    definitionOfDone: [
      "Браузер открыл Expand Testing и выполнил сценарий.",
      "Заголовок страницы найден, браузер закрылся без ошибки.",
      "В терминале появился зелёный статус выполнения.",
    ],
    hints: [
      "Сначала убедитесь, что скачанный файл лежит в текущей папке терминала.",
      "Для установки браузера используйте CLI Playwright с пакетом через npx.",
      "Успешный вывод содержит строку «Демонстрационный сценарий выполнен».",
    ],
    downloadPath: "/demos/demo-0.1.mjs",
    commands: [
      "npx --yes --package=playwright playwright install chromium",
      "npx --yes --package=playwright --call \"node demo-0.1.mjs\"",
    ],
  },
  {
    id: "0.2",
    slug: "0-2",
    title: "Создание и клонирование репозитория",
    summary: "Создать собственный GitHub-репозиторий на основе starter-template.",
    context:
      "Рабочая копия должна принадлежать ученику: тогда изменения и история проекта сохраняются отдельно от курса и могут стать портфолио.",
    theory: [
      "Template repository копирует исходное содержимое, но не связывает историю ученика с историей шаблона.",
      "Локальный clone связывает папку проекта с удалённым Git-репозиторием через remote.",
    ],
    steps: [
      "Откройте starter-template и нажмите Use this template → Create a new repository.",
      "Создайте публичный репозиторий с коротким именем, например playwright-notes-automation.",
      "Скопируйте HTTPS clone URL созданного репозитория.",
      "В терминале перейдите в папку для учебных проектов и выполните git clone <URL>.",
      "Откройте созданную папку в VS Code и проверьте git remote -v.",
    ],
    files: [
      "README.md — назначение шаблона и имя созданного проекта.",
      "Остальные стартовые файлы остаются без изменений до следующих задач.",
    ],
    definitionOfDone: [
      "Собственный GitHub-репозиторий создан из шаблона.",
      "Репозиторий клонирован в отдельную локальную папку.",
      "Папка открыта в IDE, а git remote -v указывает на репозиторий ученика.",
    ],
    hints: [
      "Создание копии и клонирование — два разных шага: сначала GitHub, затем локальный компьютер.",
      "Кнопка Use this template находится на главной странице репозитория-шаблона.",
      "Команда клонирования имеет форму git clone https://github.com/<account>/<repo>.git.",
    ],
    checkpoint: "Репозиторий создан и клонирован; отдельный commit не требуется.",
    externalLink: {
      href: "https://github.com/Alexsander13/playwright-lab-template",
      label: "Открыть starter-template на GitHub",
    },
    commands: ["git clone <URL-вашего-репозитория>", "cd <имя-репозитория>", "git remote -v"],
  },
  {
    id: "0.3",
    slug: "0-3",
    title: "Окружение и первый запуск Playwright",
    summary: "Установить зависимости и браузер, запустить базовый пример.",
    context:
      "Node.js запускает учебные скрипты, npm устанавливает зависимости, а Playwright отдельно загружает браузерные бинарники. Это три части окружения, и успешная установка одной не гарантирует наличие остальных.",
    theory: [
      "package.json описывает зависимости и команды проекта.",
      "package-lock.json фиксирует разрешённые версии; npm ci устанавливает именно их.",
      "Пакет Playwright Test и браузер Chromium устанавливаются отдельными командами.",
    ],
    steps: [
      "Проверьте node -v и npm -v; используйте поддерживаемую LTS-версию Node.js.",
      "В корне клонированного проекта выполните npm ci.",
      "Установите Chromium командой npx playwright install chromium.",
      "Запустите базовый пример командой npx playwright test.",
      "Если пример прошёл, посмотрите краткий отчёт в терминале.",
    ],
    files: [
      "node_modules/ — установленные локальные зависимости; эта папка не коммитится.",
      "package-lock.json — точные версии зависимостей.",
      "tests/example.spec.ts — базовая проверка загрузки SUT.",
    ],
    definitionOfDone: [
      "Node.js и npm доступны в терминале.",
      "npm ci завершился без ошибок.",
      "Chromium установлен, базовый Playwright test завершился успешно.",
    ],
    hints: [
      "Выполняйте команды из корня клонированного репозитория.",
      "Если npm ci сообщает, что lock-файла нет, проверьте, не пропущена ли задача 0.2 или нужный starter commit.",
      "Если Playwright сообщает об отсутствующем executable, повторите npx playwright install chromium.",
    ],
    checkpoint:
      "Сохраните подтверждённое состояние зависимостей сообщением chore: install Playwright dependencies.",
    commands: ["node -v", "npm -v", "npm ci", "npx playwright install chromium", "npx playwright test"],
  },
  {
    id: "0.4",
    slug: "0-4",
    title: "Базовая конфигурация Playwright",
    summary: "Настроить baseURL, каталог тестов, timeout и npm-команды.",
    context:
      "Когда команда запускает разные тесты, общие параметры не должны копироваться в каждый сценарий. Playwright config становится единым местом для базового URL, поиска тестов и настроек запуска.",
    theory: [
      "playwright.config.ts управляет поиском тестов и параметрами browser context.",
      "baseURL позволяет тестам переходить по относительным путям, сохраняя адрес SUT в одном месте.",
      "npm scripts дают короткие воспроизводимые команды для обычного запуска, UI и debug.",
    ],
    steps: [
      "Откройте существующий playwright.config.ts из starter-template.",
      "Проверьте testDir, timeout и use.baseURL; baseURL импортируется из src/config/env.ts.",
      "Добавьте или проверьте команды test, test:ui, test:debug и report в package.json.",
      "Запустите npm run test и отдельно откройте UI-режим.",
      "Проверьте, что отчёт доступен локальной командой report после прогона.",
    ],
    files: ["playwright.config.ts", "package.json"],
    definitionOfDone: [
      "Тесты находятся в одном testDir и обнаруживаются без явного пути.",
      "baseURL и timeout заданы централизованно в конфигурации.",
      "Команды test, test:ui, test:debug и report запускаются из npm scripts.",
    ],
    hints: [
      "Сначала найдите существующий конфиг; не создавайте второй конкурирующий файл.",
      "В Playwright Test нужные параметры задаются в defineConfig({ use, testDir, timeout }).",
      "Для обычного, UI и debug запуска используйте CLI-флаги Playwright, вызываемые из npm scripts.",
    ],
    checkpoint: "chore: configure Playwright environment and npm scripts",
    commands: ["npm run test", "npm run test:ui", "npm run test:debug", "npm run report"],
  },
  {
    id: "0.5",
    slug: "0-5",
    title: "Первый smoke-тест",
    summary: "Проверить главную Expand Testing web-first assertion и сохранить результат.",
    context:
      "Smoke-тест быстро проверяет, что сайт открылся и его ключевая страница доступна. На первом шаге достаточно проверить заголовок документа; сложные абстракции пока не нужны.",
    theory: [
      "test описывает независимый сценарий, а page предоставляет вкладку браузера.",
      "expect(page).toHaveTitle() автоматически ждёт совпадения до истечения test timeout.",
      "Относительный путь использует baseURL из конфигурации.",
    ],
    steps: [
      "Создайте tests/smoke.spec.ts.",
      "Добавьте один тест, открывающий корневой путь через page.goto('/').",
      "Проверьте title через web-first assertion с устойчивым фрагментом заголовка.",
      "Запустите тест в headless и UI-режиме.",
      "Если оба прогона успешны, зафиксируйте изменение в Git.",
    ],
    files: ["tests/smoke.spec.ts"],
    definitionOfDone: [
      "Smoke-тест открывает SUT через baseURL, без домена в тестовом файле.",
      "Заголовок проверяется через expect(page).toHaveTitle(...).",
      "Тест проходит локально в обычном и UI-режиме.",
    ],
    hints: [
      "Не добавляйте waitForTimeout: assertion сама умеет ждать ожидаемое состояние.",
      "Используйте import { test, expect } from '@playwright/test'.",
      "Проверка может выглядеть как await expect(page).toHaveTitle(/Automation Testing Practice Website/).",
    ],
    checkpoint: "test: add first smoke test for Expand Testing main page",
    commands: ["npm run test", "npm run test:ui"],
  },
];

export function getModuleZeroTask(slug: string) {
  return moduleZeroTasks.find((task) => task.slug === slug);
}