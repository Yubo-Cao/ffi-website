"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import { useCourse } from "@/components/Lesson/CourseProvider";
import { useEdit } from "@/components/Lesson/EditProvider";
import {
  addUnit,
  Course,
  LearningProgress,
  removeUnit,
  Unit,
} from "@/lib/course";
import Link from "next/link";
import { useCallback, useState } from "react";
import { MdAdd, MdDelete, MdError } from "react-icons/md";

export type CoursePageProps = {
  params: {
    courseId: string;
  };
};

function SingleUnit({
  idx,
  course,
  unit,
  learningProgress,
  isEditing,
  deleteUnit,
}: {
  idx: number;
  course: Course;
  unit: Unit;
  learningProgress?: LearningProgress[];
  isEditing: boolean;
  deleteUnit: (unitId: string) => void;
}) {
  const content = (
    <li className="max-w-xl rounded-lg bg-gray-100 p-4 dark:bg-gray-800 size-full relative">
      <h2 className="mb-2 text-lg font-semibold text-body-color">
        <span className="text-xl text-black dark:text-white">
          Unit {idx + 1}.
        </span>{" "}
        {unit.title}
      </h2>
      <ul className="flex flex-row gap-2">
        {unit.lessons.map((lesson) => (
          <div
            key={lesson.id}
            className={`size-8 rounded-md ${
              {
                "Not Started": "bg-gray-200 dark:bg-gray-700",
                "In Progress": "bg-yellow-300 dark:bg-yellow-500",
                Completed: "bg-primary",
              }[
                learningProgress?.find((lp) => lp.lessonId === lesson.id)
                  ?.progress
              ] || "bg-gray-200 dark:bg-gray-700"
            }`}
          ></div>
        ))}
      </ul>
      {isEditing && (
        <div className="absolute top-4 right-4">
          <MdDelete
            className="size-6 bg-gray-200 rounded-full p-1 text-red-500 dark:text-red-400 cursor-pointer"
            onClick={() => {
              deleteUnit(unit.id);
            }}
          />
        </div>
      )}
    </li>
  );
  return isEditing ? (
    content
  ) : (
    <Link href={`/courses/${course.id}/${unit.id}`}>{content}</Link>
  );
}

function NewUnit({
  course,
  onSubmit,
}: {
  course: Course;
  onSubmit: (unit: Unit) => void;
}) {
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");

  return (
    <li className="max-w-xl cursor-pointer rounded-lg bg-gray-100 p-4 dark:bg-gray-800 flex-1 relative">
      <div className="mb-2 text-sm font-mono text-body-color">
        <span className="text-black dark:text-white">ID: </span>
        <input
          type="text"
          placeholder="Unit ID"
          value={id}
          onChange={(e) =>
            !course.units
              .map((el) => el.id === e.target.value)
              .reduce((a, b) => a || b, false) && setId(e.target.value)
          }
          className="inline-block h-8 p-2"
          pattern={"[a-z][a-z0-9]+"}
        />
      </div>
      <div className="mb-2 text-lg font-semibold text-body-color">
        <span className="text-xl text-black dark:text-white">
          Unit {course.units.length + 1}.
        </span>{" "}
        <input
          type="text"
          placeholder="Unit title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="inline-block h-8 p-2"
        />
      </div>
      <ul className="flex flex-row gap-2">
        <div className="size-8 rounded-md bg-gray-200 dark:bg-gray-700"></div>
        <div className="size-8 rounded-md bg-gray-200 dark:bg-gray-700"></div>
        <div className="size-8 rounded-md bg-gray-200 dark:bg-gray-700"></div>
      </ul>
      <div className="absolute bottom-4 right-4">
        <MdAdd
          className="size-6 bg-gray-200 rounded-full p-1 text-primary cursor-pointer"
          onClick={() => {
            onSubmit({
              id,
              title,
              lessons: [],
              description: "",
              precedence:
                course.units
                  .map((unit) => unit.precedence)
                  .reduce((a, b) => Math.max(a, b), 0) + 10,
            });
          }}
        />
      </div>
    </li>
  );
}

export default function CoursePage() {
  const { course, error, isLoading, setCourse } = useCourse();
  const { isEditing, setIsEditing } = useEdit();

  const onAddUnit = useCallback(
    async (unit: Unit) => {
      await addUnit(course.id, unit);
      course.units.push(unit);
      setCourse(course);
      setIsEditing(false);
    },
    [course, setCourse, setIsEditing],
  );
  const deleteUnit = useCallback(
    async (unitId: string) => {
      course.units = course.units.filter((unit) => unit.id !== unitId);
      await removeUnit(unitId);
      setCourse(course);
      setIsEditing(false);
    },
    [course, setCourse, setIsEditing],
  );

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
        <ol className="grid sm:grid-cols-[repeat(auto-fit,minmax(384px,448px))] gap-4">
          {course &&
            course.units.map((unit, idx) => (
              <SingleUnit
                key={unit.id}
                idx={idx}
                course={course}
                unit={unit}
                isEditing={isEditing}
                deleteUnit={deleteUnit}
              />
            ))}
          {isEditing && <NewUnit course={course} onSubmit={onAddUnit} />}
        </ol>
      </div>
    </div>
  );
}
