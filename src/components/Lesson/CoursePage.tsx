"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import {
  Course,
  getCourse,
  getLearningProgress,
  LearningProgress,
  Unit,
} from "@/lib/course";
import Link from "next/link";
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
}) {
  return (
    <Link href={`/courses/${props.course.id}/${props.unit.id}`}>
      <li className="max-w-xl cursor-pointer rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
        <h2 className="mb-2 text-lg font-semibold text-body-color">
          <span className="text-xl text-black dark:text-white">
            Unit {props.idx + 1}.
          </span>{" "}
          {props.unit.title}
        </h2>
        <ul className="flex flex-row gap-2">
          {props.unit.lessons.map((lesson) => (
            <div
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
  const courseId = params.courseId;
  const [course, setCourse] = useState<Course>(null);
  const [status, setStatus] = useState({
    course: "loading",
    learningProgress: "loading",
  });
  const [user, setUser] = useState(null);
  const [learningProgress, setLearningProgress] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  }, []);

  useEffect(() => {
    let stat = { ...status };
    getCourse(courseId)
      .then((c) => {
        setCourse(c);
        stat.course = "success";
        setStatus(stat);
      })
      .catch((e) => {
        stat.course = "error";
        setStatus(stat);
        document.title = "Course not found";
        console.error(e);
      });
    if (user) {
      getLearningProgress(user.uid, courseId)
        .then((progress) => {
          setLearningProgress(progress);
          stat.learningProgress = "success";
          setStatus(stat);
        })
        .catch((e) => {
          stat.learningProgress = "error";
          setStatus(stat);
          console.error(e);
        });
    }
  }, [courseId, user]);

  const header = (
    <Breadcrumb
      pageName={`${status["course"] !== "error" ? course?.title || "<LOADING>" : "Error"}`}
      description={
        status["course"] !== "error"
          ? course?.description || "<LOADING>"
          : "Course not found"
      }
    />
  );

  if (status["course"] == "error") {
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
        <ol>
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
        </ol>
      </div>
    </div>
  );
}
