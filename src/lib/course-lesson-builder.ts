import type { CourseLesson } from "@/lib/module-zero";

export type LessonDefinition = Omit<CourseLesson, "moduleId" | "slug"> & {
  slug?: string;
};

export function withModuleId(
  moduleId: string,
  definitions: LessonDefinition[],
): CourseLesson[] {
  return definitions.map((definition) => ({
    ...definition,
    moduleId,
    slug: definition.slug ?? definition.id.replace(".", "-"),
  }));
}