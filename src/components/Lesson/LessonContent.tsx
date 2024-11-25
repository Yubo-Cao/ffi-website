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
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { MdError, MdMenu } from "react-icons/md";

export type LessonPageProps = {
  params: {
    courseId: string;
    unitId: string;
    lessonId: string;
  };
};

export default function LessonContent({ params }: LessonPageProps) {
  const { unit, error: unitError, isLoading: isUnitLoading } = useUnit();
  const {
    lesson,
    isLoading: isLessonLoading,
    error: lessonError,
    setLesson,
  } = useLesson();

  const header = (
    <Breadcrumb
      pageName={
        lessonError ? "Error" : isLessonLoading ? "<LOADING>" : lesson.title
      }
      parentPageName={
        unitError ? "Error" : isUnitLoading ? "<LOADING>" : unit.title
      }
      parentPageLink={`/courses/${params.courseId}/${params.unitId}`}
      description=""
      className="!static"
    />
  );

  if (lessonError || unitError) {
    return (
      <div>
        {header}
        <section className="container">
          <div className="flex flex-col items-center py-24">
            <MdError className="w-24 h-24 text-red-500 dark:text-red-400" />
            <h1 className="text-2xl font-bold text-center text-red-500 dark:text-red-400">
              Lesson not found
            </h1>
            <p className="mt-4 text-lg font-medium text-center text-body-color">
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
    <SidebarProvider>
      <LessonSidebar
        courseId={params.courseId}
        unitId={params.unitId}
        lessonId={params.lessonId}
      />
      <main className="flex-grow">
        <div className="flex items-center justify-between p-4">
          <SidebarTrigger>
            <MdMenu size={24} />
          </SidebarTrigger>
        </div>
        <Breadcrumb
          pageName={
            lessonError ? "Error" : isLessonLoading ? "<LOADING>" : lesson.title
          }
          parentPageName={
            unitError ? "Error" : isUnitLoading ? "<LOADING>" : unit.title
          }
          parentPageLink={`/courses/${params.courseId}/${params.unitId}`}
          description=""
          className="!static"
        />
        <div className="container flex flex-col justify-center">
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
        <FloatingChat context={lesson.content} />
      </main>
    </SidebarProvider>
  );
}
