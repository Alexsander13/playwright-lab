import type { CourseLesson } from "@/lib/module-zero";
import { moduleZeroTasks } from "@/lib/module-zero";
import { moduleOneTasks } from "@/lib/module-one";
import { moduleTwoTasks } from "@/lib/module-two";
import { moduleThreeTasks } from "@/lib/module-three";
import { moduleFourTasks } from "@/lib/module-four";
import { moduleFiveTasks } from "@/lib/module-five";
import { moduleSixTasks } from "@/lib/module-six";
import { moduleSevenTasks } from "@/lib/module-seven";
import { moduleEightTasks } from "@/lib/module-eight";
import { moduleNineTasks } from "@/lib/module-nine";

export type CourseModule = {
  id: string;
  title: string;
  summary: string;
  taskCount: number;
  tasks?: { id: string; slug: string; title: string }[];
};

function taskLinks(lessons: CourseLesson[]) {
  return lessons.map(({ id, slug, title }) => ({ id, slug, title }));
}

export const courseModules: CourseModule[] = [
  {
    id: "0",
    title: "Начало проекта и первая автоматизация",
    summary: "Подготовка окружения и первый рабочий smoke-тест.",
    taskCount: moduleZeroTasks.length,
    tasks: taskLinks(moduleZeroTasks),
  },
  {
    id: "1",
    title: "TypeScript для автоматизатора",
    summary: "Типы, тестовые данные, асинхронность и конфигурация.",
    taskCount: moduleOneTasks.length,
    tasks: taskLinks(moduleOneTasks),
  },
  {
    id: "2",
    title: "Надёжные UI-тесты Notes App",
    summary: "Устойчивые локаторы и сценарии работы с заметочкой.",
    taskCount: moduleTwoTasks.length,
    tasks: taskLinks(moduleTwoTasks),
  },
  {
    id: "3",
    title: "API: пользователи и заметки",
    summary: "Проверки REST API, клиенты и очистка тестовых данных.",
    taskCount: moduleThreeTasks.length,
    tasks: taskLinks(moduleThreeTasks),
  },
  {
    id: "4",
    title: "Сквозные UI + API сценарии",
    summary: "Подготовка данных через API и проверка результата в UI.",
    taskCount: moduleFourTasks.length,
    tasks: taskLinks(moduleFourTasks),
  },
  {
    id: "5",
    title: "Архитектура, fixtures и данные",
    summary: "Page Objects, fixtures, изоляция и надёжная очистка.",
    taskCount: moduleFiveTasks.length,
    tasks: taskLinks(moduleFiveTasks),
  },
  {
    id: "6",
    title: "Лаборатория возможностей Playwright",
    summary: "Файлы, фреймы, окна, диалоги, геолокация и сеть.",
    taskCount: moduleSixTasks.length,
    tasks: taskLinks(moduleSixTasks),
  },
  {
    id: "7",
    title: "Диагностика и параллельность",
    summary: "Стабильность тестов, артефакты падений и workers.",
    taskCount: moduleSevenTasks.length,
    tasks: taskLinks(moduleSevenTasks),
  },
  {
    id: "8",
    title: "Отчёты, CI и выпуск проекта",
    summary: "Отчётность, GitHub Actions, regression и sharding.",
    taskCount: moduleEightTasks.length,
    tasks: taskLinks(moduleEightTasks),
  },
  {
    id: "9",
    title: "AI-ассистенты в автоматизации",
    summary: "Локаторы с ИИ и безопасный AI-репортёр.",
    taskCount: moduleNineTasks.length,
    tasks: taskLinks(moduleNineTasks),
  },
];

export const courseTaskCount = courseModules.reduce(
  (total, courseModule) => total + courseModule.taskCount,
  0,
);