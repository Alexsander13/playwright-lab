export type CourseModule = {
  id: string;
  title: string;
  summary: string;
  taskCount: number;
};

export const courseModules: CourseModule[] = [
  {
    id: "0",
    title: "Начало проекта и первая автоматизация",
    summary: "Подготовка окружения и первый рабочий smoke-тест.",
    taskCount: 5,
  },
  {
    id: "1",
    title: "TypeScript для автоматизатора",
    summary: "Типы, тестовые данные, асинхронность и конфигурация.",
    taskCount: 6,
  },
  {
    id: "2",
    title: "Надёжные UI-тесты Notes App",
    summary: "Устойчивые локаторы и сценарии работы с заметками.",
    taskCount: 8,
  },
  {
    id: "3",
    title: "API: пользователи и заметки",
    summary: "Проверки REST API, клиенты и очистка тестовых данных.",
    taskCount: 7,
  },
  {
    id: "4",
    title: "Сквозные UI + API сценарии",
    summary: "Подготовка данных через API и проверка результата в UI.",
    taskCount: 6,
  },
  {
    id: "5",
    title: "Архитектура, fixtures и данные",
    summary: "Page Objects, fixtures, изоляция и надёжная очистка.",
    taskCount: 6,
  },
  {
    id: "6",
    title: "Лаборатория возможностей Playwright",
    summary: "Файлы, фреймы, окна, диалоги, геолокация и сеть.",
    taskCount: 8,
  },
  {
    id: "7",
    title: "Диагностика и параллельность",
    summary: "Стабильность тестов, артефакты падений и workers.",
    taskCount: 4,
  },
  {
    id: "8",
    title: "Отчёты, CI и выпуск проекта",
    summary: "Отчётность, GitHub Actions, regression и sharding.",
    taskCount: 5,
  },
  {
    id: "9",
    title: "AI-ассистенты в автоматизации",
    summary: "Локаторы с ИИ и безопасный AI-репортёр.",
    taskCount: 4,
  },
];

export const courseTaskCount = courseModules.reduce(
  (total, courseModule) => total + courseModule.taskCount,
  0,
);