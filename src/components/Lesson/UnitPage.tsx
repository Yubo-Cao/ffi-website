"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import { useCourse } from "@/components/Lesson/CourseProvider";
import { useEdit } from "@/components/Lesson/EditProvider";
import { useUnit } from "@/components/Lesson/UnitProvider";
import {
  addLesson,
  LearningProgress,
  Lesson,
  setUnit,
  Unit,
} from "@/lib/course";
import Link from "next/link";
import { useCallback, useState } from "react";
import { MdAdd } from "react-icons/md";

export type UnitPageProps = {
  params: {
    unitId: string;
    courseId: string;
  };
};

function SingleLesson(props: {
  idx: number;
  courseId: string;
  unitId: string;
  lesson: Unit["lessons"][0];
  progress?: LearningProgress;
}) {
  return (
    <Link
      href={`/courses/${props.courseId}/${props.unitId}/${props.lesson.id}`}
    >
      <li className="flex max-w-xl cursor-pointer items-center justify-between gap-4 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
        <h2 className="text-lg font-semibold text-body-color">
          <span className="text-xl text-black dark:text-white">
            Lesson {props.idx + 1}.
          </span>{" "}
          {props.lesson.title}
        </h2>
        <div
          className={`size-8 rounded-md ${
            {
              "Not Started": "bg-gray-200 dark:bg-gray-700",
              "In Progress": "bg-yellow-300 dark:bg-yellow-500",
              Completed: "bg-primary",
            }[props.progress?.progress] || "bg-gray-200 dark:bg-gray-700"
          }`}
        ></div>
      </li>
    </Link>
  );
}

function AddLesson({
  unit,
  onSubmit,
}: {
  unit: Unit;
  onSubmit: (lesson: Lesson) => void;
}) {
  const [lessonId, setLessonId] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"reading" | "quiz">("reading");
  const onClick = useCallback(
    () =>
      onSubmit({
        id: lessonId,
        title,
        precedence:
          unit.lessons
            .map((l) => l.precedence)
            .reduce((a, b) => {
              return a > b ? a : b;
            }, 0) + 10,
        content: "",
        ...(type === "quiz" && {
          questions: [],
        }),
        type: type,
      }),
    [onSubmit, lessonId, title, unit.lessons, type],
  );

  return (
    <div className="max-w-xl rounded-lg bg-gray-100 p-4 dark:bg-gray-800 relative">
      <div className="mb-2 text-sm font-mono text-body-color">
        <span className="text-black dark:text-white">Lesson ID: </span>
        <input
          type="text"
          placeholder="Lesson ID"
          value={lessonId}
          onChange={(e) =>
            !unit.lessons
              .map((el) => el.id === e.target.value)
              .reduce((a, b) => a || b, false) && setLessonId(e.target.value)
          }
          className="inline-block h-8 p-2 rounded-md bg-gray-200 dark:bg-gray-700"
          pattern={"[a-z][a-z0-9-]+"}
        />
      </div>
      <div className="mb-2 text-lg font-semibold text-body-color">
        <span className="text-xl text-black dark:text-white">
          Lesson {unit.lessons.length + 1}.
        </span>{" "}
        <input
          type="text"
          placeholder="Lesson title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="inline-block h-8 p-2 rounded-md bg-gray-200 dark:bg-gray-700"
        />
      </div>
      <div className="mb-2 text-lg font-semibold text-body-color">
        <span className="text-xl text-black dark:text-white">Type: </span>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as any)}
          className="inline-block h-8 text-sm px-2 rounded-md bg-gray-200 dark:bg-gray-700"
        >
          <option value="reading">Reading</option>
          <option value="quiz">Quiz</option>
        </select>
      </div>
      <button className="absolute right-4 bottom-4" onClick={onClick}>
        <MdAdd className="size-6 bg-gray-200 rounded-full p-1 text-primary cursor-pointer" />
      </button>
    </div>
  );
}

export default function UnitPage({ params }: UnitPageProps) {
  const {
    unit,
    error: unitError,
    isLoading: isUnitLoading,
    setUnit: setUnitCache,
  } = useUnit();
  const {
    course,
    error: courseError,
    isLoading: isCourseLoading,
  } = useCourse();
  const { isEditing, setIsEditing } = useEdit();
  const error = unitError || courseError;

  const header = (
    <Breadcrumb
      pageName={
        unitError ? "Unit not found" : isUnitLoading ? "<LOADING>" : unit?.title
      }
      description={
        unitError
          ? "The unit you are looking for does not exist"
          : isUnitLoading
            ? "<LOADING>"
            : unit?.description
      }
      parentPageName={
        courseError
          ? "Course not found"
          : isCourseLoading
            ? "<LOADING>"
            : course?.title
      }
      parentPageLink={
        courseError
          ? "/"
          : isCourseLoading
            ? "#"
            : `/courses/${params.courseId}`
      }
      isEditing={isEditing}
      onSubmit={async ({ name, description }) => {
        await setUnit({
          ...unit,
          title: name,
          description,
        });
        setUnitCache({ ...unit, title: name, description });
        setIsEditing(false);
      }}
    />
  );

  if (error) {
    return (
      <div>
        {header}
        <h1>Unit not found</h1>
      </div>
    );
  }

  return (
    <div>
      {header}
      <div className="container my-16 mt-12 grid grid-flow-col-dense">
        <ol className="grid grid-flow-row-dense sm:grid-cols-[repeat(auto-fit,minmax(384px,512px))] gap-4">
          {unit &&
            unit.lessons.map((lesson, idx) => (
              <SingleLesson
                key={lesson.id}
                idx={idx}
                courseId={course.id}
                unitId={unit.id}
                lesson={lesson}
              />
            ))}
          {isEditing && (
            <AddLesson
              unit={unit}
              onSubmit={async (lesson) => {
                await addLesson(unit.id, lesson);
                unit.lessons.push(lesson);
                setIsEditing(false);
                setUnit(unit);
              }}
            />
          )}
        </ol>
      </div>
    </div>
  );
}
