import type { CourseLesson } from "@/lib/module-zero";

export type AuditStatus =
  | "verified"
  | "ready_for_live_check"
  | "static_only"
  | "external_exception";

export type LiveAssertion =
  | { kind: "role"; role: "heading" | "link" | "button"; name: string }
  | { kind: "label"; name: string }
  | { kind: "testId"; name: string }
  | { kind: "text"; name: string; exact?: boolean }
  | { kind: "selector"; value: string }
  | { kind: "api"; path: string; expectedStatus: number; expectedField: string };

export type CourseAuditCard = {
  lessonId: string;
  lessonTitle: string;
  learningGoal: string;
  url: string | null;
  locators: string[];
  keyAssertion: string;
  status: AuditStatus;
  exceptionReason?: string;
  lastLiveVerifiedAt: string | null;
  liveAssertion?: LiveAssertion;
};

type Blueprint = Omit<CourseAuditCard, "lessonTitle">;

const noLive = (lessonId: string, learningGoal: string, exceptionReason: string): Blueprint => ({
  lessonId,
  learningGoal,
  url: null,
  locators: [],
  keyAssertion: "Проверить наблюдаемый результат, описанный в Definition of Done.",
  status: "external_exception",
  exceptionReason,
  lastLiveVerifiedAt: null,
});

const entries = (lessonIds: string[], blueprint: Omit<Blueprint, "lessonId">): Blueprint[] =>
  lessonIds.map((lessonId) => ({ lessonId, ...blueprint }));

/**
 * Реестр является чек-листом аудита, а не вторым набором текстов урока.
 * Статус ready_for_live_check означает: код и текст прошли статическую сверку,
 * но актуальность стенда должна подтвердить команда `npm run audit:live`.
 */
const auditBlueprints: Blueprint[] = [
  {
    lessonId: "0.1",
    learningGoal: "Увидеть первый запуск браузерной автоматизации.",
    url: "/",
    locators: ["heading"],
    keyAssertion: "Главный заголовок стенда видим после перехода.",
    status: "ready_for_live_check",
    lastLiveVerifiedAt: null,
  },
  noLive("0.2", "Создать собственный репозиторий из шаблона.", "GitHub — инфраструктурный инструмент, а не SUT курса."),
  {
    lessonId: "0.3",
    learningGoal: "Установить зависимости и браузер Playwright.",
    url: "/",
    locators: ["heading"],
    keyAssertion: "Первый запуск Playwright проходит без ошибки окружения.",
    status: "ready_for_live_check",
    lastLiveVerifiedAt: null,
  },
  {
    lessonId: "0.4",
    learningGoal: "Настроить baseURL до использования относительных путей.",
    url: "/",
    locators: ["baseURL в playwright.config.ts"],
    keyAssertion: "Smoke-тест с page.goto('/') открывает стенд.",
    status: "static_only",
    lastLiveVerifiedAt: null,
  },
  {
    lessonId: "0.5",
    learningGoal: "Написать первый smoke-тест главной страницы.",
    url: "/",
    locators: ["page title"],
    keyAssertion: "expect(page).toHaveTitle(/Automation Testing Practice Website/)",
    status: "verified",
    lastLiveVerifiedAt: "2026-10-01",
    liveAssertion: { kind: "role", role: "link", name: "Web inputs" },
  },
  {
    lessonId: "1.1",
    learningGoal: "Открыть стенд, перейти в Web inputs и подтвердить результат перехода.",
    url: "/",
    locators: ["getByRole('link', { name: 'Web inputs' })", "getByRole('heading', { name: 'Web inputs page for Automation Testing Practice' })"],
    keyAssertion: "Заголовок Web inputs видим после клика.",
    status: "verified",
    lastLiveVerifiedAt: "2026-10-01",
    liveAssertion: { kind: "role", role: "link", name: "Web inputs" },
  },
  {
    lessonId: "1.2",
    learningGoal: "Заполнить настоящую форму Inputs и проверить выведенное значение.",
    url: "/inputs",
    locators: ["getByLabel('Input: Text')", "getByLabel('Input: Password')", "getByRole('button', { name: 'Display Inputs' })"],
    keyAssertion: "Введённый текст видим после Display Inputs.",
    status: "verified",
    lastLiveVerifiedAt: "2026-10-01",
    liveAssertion: { kind: "label", name: "Input: Text" },
  },
  ...entries(["1.3", "1.4"], {
    learningGoal: "Применить async/await и Promise.all к независимым запросам Notes API.",
    url: "/notes/api",
    locators: ["APIRequestContext"],
    keyAssertion: "Статус и JSON-ответ API подтверждены через expect.",
    status: "verified",
    lastLiveVerifiedAt: "2026-10-01",
    liveAssertion: { kind: "api", path: "/notes/api", expectedStatus: 200, expectedField: "success" },
  }),
  ...entries(["1.5", "1.6", "1.7", "1.8", "1.9"], {
    learningGoal: "Постепенно освоить конфигурацию, типы и фабрики тестовых данных.",
    url: "/notes/app",
    locators: ["BASE_URL", "типизированные DTO"],
    keyAssertion: "TypeScript-проверка или тест с данными завершается успешно.",
    status: "static_only",
    lastLiveVerifiedAt: null,
  }),
  ...entries(["2.1", "2.2"], {
    learningGoal: "Выбрать устойчивый user-facing локатор для интерфейса Notes App.",
    url: "/notes/app",
    locators: ["getByRole", "getByTestId"],
    keyAssertion: "Найденный локатор видим через expect(...).toBeVisible().",
    status: "verified",
    lastLiveVerifiedAt: "2026-10-01",
  }),
  ...entries(["2.3", "2.4", "2.5", "2.8"], {
    learningGoal: "Выполнить изолированный UI-сценарий Notes App от регистрации до очистки данных.",
    url: "/notes/app",
    locators: ["getByTestId", "getByRole", "getByLabel", "getByText"],
    keyAssertion: "Пользовательский результат действия подтверждён web-first assertion.",
    status: "verified",
    lastLiveVerifiedAt: "2026-10-01",
  }),
  ...entries(["2.6", "2.7"], {
    learningGoal: "Выполнить изолированный UI-сценарий изменения и удаления заметки в Notes App.",
    url: "/notes/app",
    locators: ["getByTestId", "getByRole", "getByText"],
    keyAssertion: "Пользовательский результат действия подтверждён web-first assertion.",
    status: "verified",
    lastLiveVerifiedAt: "2026-10-01",
  }),
  {
    lessonId: "3.1",
    learningGoal: "Проверить доступность Notes API без запуска браузера.",
    url: "/notes/api",
    locators: ["APIRequestContext", "status", "JSON contract"],
    keyAssertion: "HTTP 200 и поле success подтверждены через expect.",
    status: "verified",
    lastLiveVerifiedAt: "2026-10-01",
    liveAssertion: { kind: "api", path: "/notes/api", expectedStatus: 200, expectedField: "success" },
  },
  ...entries(["3.2", "3.3", "3.5", "3.6", "3.7"], {
    learningGoal: "Проверить жизненный цикл пользователя и заметки через публичный Notes API.",
    url: "/notes/api",
    locators: ["APIRequestContext", "status", "JSON contract"],
    keyAssertion: "Код ответа и контракт JSON подтверждены через expect.",
    status: "verified",
    lastLiveVerifiedAt: "2026-10-01",
  }),
  {
    lessonId: "3.4",
    learningGoal: "Собрать тонкий типизированный API client поверх уже проверенного публичного контракта.",
    url: "/notes/api",
    locators: ["APIRequestContext", "status", "JSON contract"],
    keyAssertion: "Методы client возвращают response публичного API без скрытых действий.",
    status: "static_only",
    exceptionReason: "Структура TypeScript-клиента проверяется статическим аудитом; его публичные endpoint уже live-подтверждены уроками 3.2, 3.3, 3.5–3.7.",
    lastLiveVerifiedAt: "2026-10-01",
  },
  ...entries(["4.1", "4.2", "4.3", "4.4", "4.5", "4.6"], {
    learningGoal: "Связать подготовку данных Notes API с наблюдаемым результатом Notes App.",
    url: "/notes/app",
    locators: ["getByText", "getByRole", "storageState"],
    keyAssertion: "Один и тот же результат подтверждён в UI и API.",
    status: "ready_for_live_check",
    lastLiveVerifiedAt: null,
  }),
  ...entries(["5.1", "5.2", "5.3", "5.4", "5.5", "5.6", "5.7", "5.8", "5.9"], {
    learningGoal: "Организовать изолированные UI/API-тесты Notes App без прямого доступа к БД.",
    url: "/notes/app",
    locators: ["Page Object", "fixture", "Notes API"],
    keyAssertion: "Тест подтверждает результат и очищает только собственные данные.",
    status: "ready_for_live_check",
    lastLiveVerifiedAt: null,
  }),
  {
    lessonId: "6.1", learningGoal: "Загрузить файл и увидеть имя файла в UI.", url: "/upload",
    locators: ["file input", "getByText"], keyAssertion: "Имя файла или подтверждение загрузки видимо.", status: "verified", lastLiveVerifiedAt: "2026-10-01", liveAssertion: { kind: "role", role: "heading", name: "File Uploader page for Automation Testing Practice" },
  },
  {
    lessonId: "6.2", learningGoal: "Перехватить скачивание и проверить файл.", url: "/download",
    locators: ["getByRole('link')", "download event"], keyAssertion: "Имя и содержимое скачанного файла проверены.", status: "verified", lastLiveVerifiedAt: "2026-10-01", liveAssertion: { kind: "role", role: "heading", name: "File Downloader page for Automation Testing Practice" },
  },
  {
    lessonId: "6.3", learningGoal: "Обработать dialog до действия-триггера.", url: "/js-dialogs",
    locators: ["getByRole('button')", "dialog event"], keyAssertion: "UI отражает выбранный ответ dialog.", status: "verified", lastLiveVerifiedAt: "2026-10-01", liveAssertion: { kind: "role", role: "heading", name: "JavaScript Dialogs page for Automation Testing Practice" },
  },
  {
    lessonId: "6.4", learningGoal: "Взаимодействовать с элементом внутри iframe.", url: "/iframe",
    locators: ["frameLocator", "getByRole"], keyAssertion: "Результат действия внутри iframe видим.", status: "verified", lastLiveVerifiedAt: "2026-10-01", liveAssertion: { kind: "role", role: "heading", name: "IFrame page for Automation Testing Practice" },
  },
  {
    lessonId: "6.5", learningGoal: "Без гонки перехватить новую вкладку.", url: "/windows",
    locators: ["context.waitForEvent('page')", "getByRole('link')"], keyAssertion: "Новая Page открыта и её URL или заголовок подтверждены.", status: "verified", lastLiveVerifiedAt: "2026-10-01", liveAssertion: { kind: "role", role: "heading", name: "Opening a new window page for Automation Testing Practice" },
  },
  {
    lessonId: "6.6", learningGoal: "Проверить публичное поведение Shadow DOM.", url: "/shadowdom",
    locators: ["getByRole", "getByText"], keyAssertion: "Публичный элемент доступен без обхода closed shadow root.", status: "verified", lastLiveVerifiedAt: "2026-10-01", liveAssertion: { kind: "role", role: "heading", name: "Shadow DOM page for Automation Testing Practice" },
  },
  {
    lessonId: "6.7", learningGoal: "Проверить реакцию UI на геолокацию.", url: "/geolocation",
    locators: ["grantPermissions", "geolocation"], keyAssertion: "UI показывает результат для настроенных координат.", status: "ready_for_live_check", lastLiveVerifiedAt: null,
  },
  {
    lessonId: "6.8", learningGoal: "Смоделировать success и error без нового внешнего домена.", url: "/notes/app",
    locators: ["page.route", "getByRole", "getByText"], keyAssertion: "Успешное и ошибочное состояние UI подтверждены отдельно.", status: "ready_for_live_check", lastLiveVerifiedAt: null,
  },
  ...entries(["6.9", "6.10"], {
    learningGoal: "Проверить реальный интерфейс Notes App в отдельной среде Playwright.", url: "/notes/app",
    locators: ["getByRole", "toHaveScreenshot", "devices"], keyAssertion: "Заголовок или ключевая ссылка видимы перед снимком либо mobile-проверкой.", status: "ready_for_live_check", lastLiveVerifiedAt: null,
  }),
  {
    lessonId: "6.11", learningGoal: "Выполнить drag-and-drop на учебной странице.", url: "/drag-and-drop",
    locators: ["#column-a", "#column-b"], keyAssertion: "После переноса виден ожидаемый порядок элементов.", status: "verified", lastLiveVerifiedAt: "2026-10-01",
    exceptionReason: "Стабильные id зон используются, потому что страница не предоставляет доступные имена для source и target.",
    liveAssertion: { kind: "selector", value: "#column-a" },
  },
  {
    lessonId: "7.1", learningGoal: "Диагностировать нестабильную страницу без фиксированных пауз.", url: "/flaky-test",
    locators: ["getByRole", "web-first assertion"], keyAssertion: "Тест ждёт конкретное наблюдаемое состояние.", status: "ready_for_live_check", lastLiveVerifiedAt: null,
  },
  ...entries(["7.2", "7.3", "7.4"], {
    learningGoal: "Сделать тесты Notes App диагностируемыми и безопасными для параллельного запуска.", url: "/notes/app",
    locators: ["trace", "runId", "workerIndex"], keyAssertion: "Изоляция данных и артефакты падения подтверждены настройкой или тестом.", status: "static_only", lastLiveVerifiedAt: null,
  }),
  {
    lessonId: "8.1", learningGoal: "Прочитать встроенный отчёт Playwright после теста Expand Testing.", url: "/",
    locators: ["HTML report", "expect"], keyAssertion: "Отчёт отражает статус и assertion запущенного теста.", status: "static_only", lastLiveVerifiedAt: null,
  },
  ...["8.2", "8.3", "8.4", "8.5", "8.6", "8.7"].map((lessonId) => noLive(lessonId, "Настроить отчётность или CI для тестов Expand Testing.", "CI и отчёты — инфраструктура курса; сами тесты продолжают использовать Expand Testing.")),
  noLive("9.1", "Настроить локальный AI-инструмент без раскрытия ключа.", "Настройка IDE и OpenRouter выполняется локально и не является SUT."),
  {
    lessonId: "9.2", learningGoal: "Подтвердить AI-предложенный локатор на реальном интерфейсе.", url: "/notes/app",
    locators: ["getByRole", "getByTestId"], keyAssertion: "Локатор вручную подтверждён в Inspector и web-first assertion.", status: "ready_for_live_check", lastLiveVerifiedAt: null,
  },
  ...["9.3", "9.4"].map((lessonId) => noLive(lessonId, "Собрать безопасный отчёт о падении теста.", "Reporter и OpenRouter — инфраструктурные дополнения; тесты остаются на Expand Testing.")),
];

export function createCourseAuditRegistry(tasks: CourseLesson[]): CourseAuditCard[] {
  const taskById = new Map(tasks.map((task) => [task.id, task]));
  const duplicateIds = auditBlueprints.filter((item, index) => auditBlueprints.findIndex(({ lessonId }) => lessonId === item.lessonId) !== index);
  const unknownIds = auditBlueprints.filter(({ lessonId }) => !taskById.has(lessonId));
  const missingIds = tasks.filter(({ id }) => !auditBlueprints.some(({ lessonId }) => lessonId === id));

  if (duplicateIds.length || unknownIds.length || missingIds.length) {
    throw new Error(`Неконсистентный реестр аудита: дубликаты=${duplicateIds.map(({ lessonId }) => lessonId).join(",")}; неизвестные=${unknownIds.map(({ lessonId }) => lessonId).join(",")}; пропущенные=${missingIds.map(({ id }) => id).join(",")}`);
  }

  return auditBlueprints.map((blueprint) => ({
    ...blueprint,
    lessonTitle: taskById.get(blueprint.lessonId)?.title ?? blueprint.lessonId,
  }));
}

export const courseAuditBlueprintCount = auditBlueprints.length;
