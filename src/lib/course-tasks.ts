import { moduleOneTasks } from "@/lib/module-one";
import { moduleZeroTasks } from "@/lib/module-zero";

export const courseTasks = [...moduleZeroTasks, ...moduleOneTasks];

export function getCourseTask(moduleId: string, slug: string) {
  return courseTasks.find(
    (task) => task.moduleId === moduleId && task.slug === slug,
  );
}