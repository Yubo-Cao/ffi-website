"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import { useCourse } from "@/components/Lesson/CourseProvider";
import { useEdit } from "@/components/Lesson/EditProvider";
import { Course, LearningProgress, Unit } from "@/lib/course";
import Link from "next/link";
import { useState } from "react";
import { MdError } from "react-icons/md";

export type CoursePageProps = {
  params: {
    courseId: string;
  };
};

function SingleUnit(props: {
  idx: number;
  course: Course;
  unit: Unit;
  learningProgress?: LearningProgress[];
  isEditing?: boolean;
}) {
  return (
    <Link href={`/courses/${props.course.id}/${props.unit.id}`}>
      <li className="max-w-xl cursor-pointer rounded-lg bg-gray-100 p-4 dark:bg-gray-800 size-full">
        <h2 className="mb-2 text-lg font-semibold text-body-color">
          <span className="text-xl text-black dark:text-white">
            Unit {props.idx + 1}.
          </span>{" "}
          {props.unit.title}
        </h2>
        <ul className="flex flex-row gap-2">
          {props.unit.lessons.map((lesson) => (
            <div
              key={lesson.id}
              className={`size-8 rounded-md ${
                {
                  "Not Started": "bg-gray-200 dark:bg-gray-700",
                  "In Progress": "bg-yellow-300 dark:bg-yellow-500",
                  Completed: "bg-primary",
                }[
                  props.learningProgress?.find(
                    (lp) => lp.lessonId === lesson.id,
                  )?.progress
                ] || "bg-gray-200 dark:bg-gray-700"
              }`}
            ></div>
          ))}
        </ul>
      </li>
    </Link>
  );
}

export default function CoursePage({ params }: CoursePageProps) {
  const { course, error, isLoading } = useCourse();
  const { isEditing, setIsEditing } = useEdit();
  const [learningProgress, setLearningProgress] = useState(null);

  const header = (
    <Breadcrumb
      pageName={
        error ? "Course not found" : isLoading ? "<LOADING>" : course.title
      }
      description={
        error
          ? "The course you are looking for does not exist"
          : isLoading
            ? "<LOADING>"
            : course.description
      }
    />
  );

  if (error != null) {
    return (
      <div>
        {header}
        <section className="container">
          <div className="flex flex-col items-center py-24">
            <MdError className="h-24 w-24 flex-initial text-red-500 dark:text-red-400" />
            <h1 className="text-center text-2xl font-bold text-red-500 dark:text-red-400">
              Course not found
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
    <div>
      {header}

      <div className="container my-16 mt-12 grid grid-flow-col-dense">
        <ol className="grid grid-cols-[repeat(auto-fit,minmax(384px,448px))] gap-4">
          {course &&
            course.units.map((unit, idx) => (
              <SingleUnit
                key={unit.id}
                idx={idx}
                course={course}
                unit={unit}
                learningProgress={learningProgress}
              />
            ))}
          {isEditing && (
            <li className="max-w-xl cursor-pointer rounded-lg bg-gray-100 p-4 dark:bg-gray-800 flex-1">
              <div className="mb-2 text-lg font-semibold text-body-color">
                <span className="text-xl text-black dark:text-white">
                  Unit {course.units.length + 1}.
                </span>{" "}
                <input
                  type="text"
                  placeholder="Unit title"
                  className="inline-block h-8 p-2"
                />
              </div>
              <ul className="flex flex-row gap-2">
                <div className="size-8 rounded-md bg-gray-200 dark:bg-gray-700"></div>
                <div className="size-8 rounded-md bg-gray-200 dark:bg-gray-700"></div>
                <div className="size-8 rounded-md bg-gray-200 dark:bg-gray-700"></div>
              </ul>
            </li>
          )}
        </ol>
      </div>
    </div>
  );
}
