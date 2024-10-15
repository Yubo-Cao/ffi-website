"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import { useAuth } from "@/components/Common/UserProvider";
import {
  Course,
  getCourse,
  getLearningProgress,
  getUnit,
  LearningProgress,
  Unit,
} from "@/lib/course";
import Link from "next/link";
import { useEffect, useState } from "react";

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

export default function UnitPage({ params }: UnitPageProps) {
  const unitId = params.unitId;
  const courseId = params.courseId;
  const [unit, setUnit] = useState<Unit>(null);
  const [course, setCourse] = useState<Course>(null);
  const [status, setStatus] = useState({
    unit: "loading",
    course: "loading",
    learningProgress: "loading",
  });
  const { user } = useAuth();
  const [learningProgress, setLearningProgress] =
    useState<LearningProgress[]>(null);

  useEffect(() => {
    getUnit(unitId)
      .then((u) => {
        setUnit(u);
        setStatus((prevStatus) => ({ ...prevStatus, unit: "success" }));
      })
      .catch((e) => {
        setStatus((prevStatus) => ({ ...prevStatus, unit: "error" }));
        console.error(e);
      });

    getCourse(courseId)
      .then((c) => {
        setCourse(c);
        setStatus((prevStatus) => ({ ...prevStatus, course: "success" }));
      })
      .catch((e) => {
        setStatus((prevStatus) => ({ ...prevStatus, course: "error" }));
        console.error(e);
      });

    if (user) {
      getLearningProgress(user.uid)
        .then((progress) => {
          setLearningProgress(progress);
          setStatus((prevStatus) => ({
            ...prevStatus,
            learningProgress: "success",
          }));
        })
        .catch((e) => {
          setStatus((prevStatus) => ({
            ...prevStatus,
            learningProgress: "error",
          }));
          console.error(e);
        });
    }
  }, [unitId, courseId, user]);

  const header = (
    <Breadcrumb
      pageName={`${unit?.title || "<LOADING>"}`}
      parentPageName={`${course?.title || "<LOADING>"}`}
      description={unit?.description || "<LOADING>"}
    />
  );

  if (
    status.unit === "error" ||
    status.course === "error" ||
    status.learningProgress === "error"
  ) {
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
        <ol className="grid grid-flow-row-dense grid-cols-[repeat(auto-fit,minmax(384px,512px))] gap-4">
          {unit &&
            unit.lessons.map((lesson, idx) => (
              <SingleLesson
                key={lesson.id}
                idx={idx}
                courseId={courseId}
                unitId={unitId}
                lesson={lesson}
                progress={learningProgress?.find(
                  (lp) => lp.lessonId === lesson.id,
                )}
              />
            ))}
        </ol>
      </div>
    </div>
  );
}
