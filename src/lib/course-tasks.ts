import { moduleTwoTasks } from "@/lib/module-two";
import { moduleOneTasks } from "@/lib/module-one";
import { moduleZeroTasks } from "@/lib/module-zero";
import { moduleThreeTasks } from "@/lib/module-three";
import { moduleFourTasks } from "@/lib/module-four";
import { moduleFiveTasks } from "@/lib/module-five";
import { moduleSixTasks } from "@/lib/module-six";
import { moduleSevenTasks } from "@/lib/module-seven";
import { moduleEightTasks } from "@/lib/module-eight";
import { moduleNineTasks } from "@/lib/module-nine";
import { adaptLessonForBeginner } from "@/lib/beginner-lesson-content";

const rawCourseTasks = [
  ...moduleZeroTasks,
  ...moduleOneTasks,
  ...moduleTwoTasks,
  ...moduleThreeTasks,
  ...moduleFourTasks,
  ...moduleFiveTasks,
  ...moduleSixTasks,
  ...moduleSevenTasks,
  ...moduleEightTasks,
  ...moduleNineTasks,
];

export const courseTasks = rawCourseTasks.map(adaptLessonForBeginner);

export function getCourseTask(moduleId: string, slug: string) {
  return courseTasks.find(
    (task) => task.moduleId === moduleId && task.slug === slug,
  );
}
