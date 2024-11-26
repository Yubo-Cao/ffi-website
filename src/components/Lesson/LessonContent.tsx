import { ProgressUpdater } from "./ProgressUpdater";
import { QuizContent } from "./QuizContent";
import { ReadingContent } from "./ReadingContent";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import type { Lesson, Unit } from "@/lib/course";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface LessonContentProps {
  lesson: Lesson;
  unit: Unit;
  courseId: string;
  unitId: string;
  lessonId: string;
  userId: string;
}

export function LessonContent({
  lesson,
  unit,
  courseId,
  unitId,
  lessonId,
  userId,
}: LessonContentProps) {
  return (
    <div className="flex flex-col header-space">
      <header className="container">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/courses/${courseId}`}>
                Course
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="w-4 h-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/courses/${courseId}/${unitId}`}>
                {unit.title}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="w-4 h-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/courses/${courseId}/${unitId}/${lessonId}`}
              >
                {lesson.title}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <main className="container flex-1 py-8">
        {lesson.type === "reading" ? (
          <ReadingContent userId={userId} lesson={lesson} />
        ) : (
          <QuizContent userId={userId} lesson={lesson} />
        )}

        <LessonNavigation
          lesson={lesson}
          unit={unit}
          courseId={courseId}
          unitId={unitId}
        />
      </main>

      <ProgressUpdater userId={userId} lessonId={lessonId} />
    </div>
  );
}

function LessonNavigation({
  lesson,
  unit,
  courseId,
  unitId,
}: {
  lesson: Lesson;
  unit: Unit;
  courseId: string;
  unitId: string;
}) {
  const currentIndex = unit.lessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = unit.lessons[currentIndex - 1];
  const nextLesson = unit.lessons[currentIndex + 1];

  return (
    <div>
      <div className="container flex justify-between mt-8">
        {prevLesson ? (
          <Button variant="outline" asChild>
            <Link href={`/courses/${courseId}/${unitId}/${prevLesson.id}`}>
              Previous Lesson
            </Link>
          </Button>
        ) : (
          <div />
        )}

        {nextLesson && (
          <Button asChild variant="outline">
            <Link href={`/courses/${courseId}/${unitId}/${nextLesson.id}`}>
              Next Lesson
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
