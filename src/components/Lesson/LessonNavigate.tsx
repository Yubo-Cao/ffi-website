import { useUnit } from "@/components/Lesson/UnitProvider";
import { Button } from "@/components/ui/button";
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
    return null;
  }

  return (
    <div className="flex justify-between mt-16">
      {unit && lesson && unit.lessons && unit.lessons.length > 0 && (
        <>
          {unit.lessons.findIndex(predicate) > 0 && (
            <Button asChild variant="outline">
              <Link
                href={`/courses/${courseId}/${unitId}/${
                  unit.lessons[unit.lessons.findIndex(predicate) - 1].id
                }`}
              >
                Previous Lesson
              </Link>
            </Button>
          )}
          {unit.lessons.findIndex(predicate) < unit.lessons.length - 1 && (
            <Button asChild>
              <Link
                href={`/courses/${courseId}/${unitId}/${
                  unit.lessons[unit.lessons.findIndex(predicate) + 1].id
                }`}
              >
                Next Lesson
              </Link>
            </Button>
          )}
        </>
      )}
    </div>
  );
}
