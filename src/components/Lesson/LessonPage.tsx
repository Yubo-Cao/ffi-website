"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import Loader from "@/components/Common/Loader";
import { FloatingChat } from "@/components/Lesson/Chat";
import { LessonNavigate } from "@/components/Lesson/LessonNavigate";
import { useLesson } from "@/components/Lesson/LessonProvider";
import LessonSidebar from "@/components/Lesson/LessonSidebar";
import Quiz from "@/components/Lesson/Quiz/Quiz";
import ReadingLesson from "@/components/Lesson/ReadingLesson";
import { useUnit } from "@/components/Lesson/UnitProvider";
import Link from "next/link";
import { useEffect } from "react";
import { MdError } from "react-icons/md";

export type LessonPageProps = {
  params: {
    courseId: string;
    unitId: string;
    lessonId: string;
  };
};

export default function LessonPage({ params }: LessonPageProps) {
  const { unit, error: unitError, isLoading: isUnitLoading } = useUnit();
  const {
    lesson,
    isLoading: isLessonLoading,
    error: lessonError,
    setLesson,
  } = useLesson();

  useEffect(() => {
    if (!isLessonLoading) document.title = `${lesson.title}`;
  }, [lesson, isLessonLoading]);

  const header = (
    <Breadcrumb
      pageName={`${lessonError != null ? "Error" : isLessonLoading ? "<LOADING>" : lesson.title}`}
      parentPageName={`${unitError != null ? "Error" : isUnitLoading ? "<LOADING>" : unit.title}`}
      parentPageLink={`/courses/${params.courseId}/${params.unitId}`}
      description={""}
      className={`!static`}
    />
  );

  if (lessonError != null || unitError != null) {
    return (
      <div>
        {header}
        <section className="container">
          <div className="flex flex-col items-center py-24">
            <MdError className="h-24 w-24 flex-initial text-red-500 dark:text-red-400" />
            <h1 className="text-center text-2xl font-bold text-red-500 dark:text-red-400">
              Lesson not found
            </h1>
            <p className="mt-4 text-center text-lg font-medium text-body-color">
              Take me back to{" "}
              <Link href="/public" className="text-primary">
                home
              </Link>
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row">
        <LessonSidebar
          courseId={params.courseId}
          unitId={params.unitId}
          lessonId={params.lessonId}
        />
        <div className="flex-grow relative 2xl:pl-12">
          {header}
          <div className="container my-16">
            {isLessonLoading ? (
              <Loader size={12} />
            ) : lesson.type === "reading" ? (
              <ReadingLesson
                content={lesson.content}
                lesson={lesson}
                setLesson={setLesson}
              />
            ) : (
              <Quiz lesson={lesson} setLesson={setLesson} />
            )}
            <LessonNavigate
              lesson={lesson}
              courseId={params.courseId}
              unitId={params.unitId}
            />
          </div>
        </div>
        <FloatingChat context={lesson.content} />
      </div>
    </>
  );
}
