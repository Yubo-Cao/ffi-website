import { useUnit } from "@/components/Lesson/UnitProvider";
import { Lesson } from "@/lib/course";
import Link from "next/link";
import { useCallback } from "react";

export function LessonNavigate({
  lesson,
  courseId,
  unitId,
}: {
  lesson: Lesson;
  courseId: string;
  unitId: string;
}) {
  const { unit, isLoading } = useUnit();
  const predicate = useCallback((l) => l.id === lesson.id, [lesson]);

  if (isLoading) {
    return;
  }

  return (
    <div className="mt-16 flex justify-between">
      {unit && lesson && unit.lessons && unit.lessons.length > 0 && (
        <>
          {unit.lessons.findIndex(predicate) > 0 && (
            <Link
              href={`/courses/${courseId}/${unitId}/${unit.lessons[unit.lessons.findIndex(predicate) - 1].id}`}
              className="rounded-md bg-primary px-4 py-2 text-white"
            >
              Previous Lesson
            </Link>
          )}
          {unit.lessons.findIndex(predicate) < unit.lessons.length - 1 && (
            <Link
              href={`/courses/${courseId}/${unitId}/${unit.lessons[unit.lessons.findIndex(predicate) + 1].id}`}
              className="rounded-md bg-primary px-4 py-2 text-white"
            >
              Next Lesson
            </Link>
          )}
        </>
      )}
    </div>
  );
}
