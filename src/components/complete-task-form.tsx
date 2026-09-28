"use client";

import { Check, LoaderCircle } from "lucide-react";
import { useActionState } from "react";

import { completeCourseTaskAction } from "@/app/actions";
import type { CourseTaskActionState } from "@/lib/course-progress";

type CompleteTaskFormProps = {
  moduleId: string;
  slug: string;
  taskId: string;
};

const initialState: CourseTaskActionState = {
  status: "idle",
  message: "",
};

export function CompleteTaskForm({
  moduleId,
  slug,
  taskId,
}: CompleteTaskFormProps) {
  const [state, formAction, isPending] = useActionState(
    completeCourseTaskAction,
    initialState,
  );

  return (
    <div aria-busy={isPending}>
      {state.status === "success" ? (
        <p
          aria-live="polite"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[var(--accent)]"
          role="status"
        >
          <Check aria-hidden="true" size={18} />
          {state.message}
        </p>
      ) : (
        <form action={formAction}>
          <input name="moduleId" type="hidden" value={moduleId} />
          <input name="slug" type="hidden" value={slug} />
          <button
            className="inline-flex min-h-11 min-w-56 items-center justify-center gap-2 rounded-md bg-[var(--accent)] px-5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-wait disabled:opacity-75"
            disabled={isPending}
            type="submit"
          >
            {isPending ? (
              <>
                <LoaderCircle
                  aria-hidden="true"
                  className="animate-spin"
                  size={17}
                />
                <span>Сохраняем прогресс…</span>
              </>
            ) : (
              "Отметить задачу выполненной"
            )}
          </button>
        </form>
      )}

      {state.status === "error" ? (
        <p
          aria-live="polite"
          className="mt-3 border-l-2 border-red-600 pl-3 text-sm text-red-800"
          role="alert"
        >
          {state.message}
        </p>
      ) : null}
    </div>
  );
}