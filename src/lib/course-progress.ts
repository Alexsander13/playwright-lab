export type CourseTaskActionState = {
  status: "idle" | "success" | "error";
  message: string;
};