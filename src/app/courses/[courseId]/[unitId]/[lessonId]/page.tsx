"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import {
  getLearningProgress,
  getLesson,
  getUnit,
  LearningProgress,
  Lesson,
  Unit,
} from "@/lib/course";
import ReadingLesson from "@/components/Lesson/ReadingLesson";
import QuizLesson from "@/components/Lesson/QuizLesson";
import {
  MdCheck,
  MdChevronLeft,
  MdChevronRight,
  MdEdit,
  MdError,
} from "react-icons/md";
import Link from "next/link";

type LessonPageProps = {
  params: {
    courseId: string;
    unitId: string;
    lessonId: string;
  };
};

export default function LessonPage({ params }: LessonPageProps) {
  const lessonId = params.lessonId;
  const [lesson, setLesson] = useState<Lesson>(null);
  const [unit, setUnit] = useState<Unit>(null);
  const [learningProgress, setLearningProgress] =
    useState<LearningProgress>(null);
  const [status, setStatus] = useState({
    lesson: "loading",
    unit: "loading",
    learningProgress: "loading",
  });
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const auth = getAuth();

  // Ensure user is in sync with auth
  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        // TODO: Implement true admin check
        setIsAdmin(user.email === "cao2006721@gmail.com");
      }
    });
  }, []);
  // Fetch lesson, unit, and learning progress
  useEffect(() => {
    getLesson(lessonId)
      .then((l) => {
        setLesson(l);
        setStatus((prevStatus) => ({ ...prevStatus, lesson: "success" }));
        return getUnit(params.unitId);
      })
      .then((u) => {
        setUnit(u);
        setStatus((prevStatus) => ({ ...prevStatus, unit: "success" }));
      })
      .catch((e) => {
        setStatus((prevStatus) => ({
          ...prevStatus,
          lesson: "error",
          unit: "error",
        }));
        console.error(e);
      });

    if (user) {
      getLearningProgress(user.uid)
        .then((progress) => {
          const lessonProgress = progress.find(
            (lp) => lp.lessonId === lessonId,
          );
          setLearningProgress(lessonProgress);
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
  }, [lessonId, user]);

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const header = (
    <Breadcrumb
      pageName={`${status.lesson !== "error" ? lesson?.title || "<LOADING>" : "Error"}`}
      description={""}
    />
  );

  if (
    status.lesson === "error" ||
    status.unit === "error" ||
    status.learningProgress === "error"
  ) {
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
              <Link href="/" className="text-primary">
                home
              </Link>
            </p>
          </div>
        </section>
      </div>
    );
  }

  const sidebar = unit && (
    <>
      <div
        className={`transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-72" : "w-12"
        } relative hidden border-r-2 border-primary p-6 pt-[120px] sm:pt-[180px] lg:pt-[206px] 2xl:block`}
      >
        <div
          className="absolute -right-6 top-1/2 -translate-y-1/2 transform cursor-pointer rounded-full bg-gray-200 p-2 hover:bg-opacity-80 dark:bg-gray-700"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? (
            <MdChevronLeft size={24} />
          ) : (
            <MdChevronRight size={24} />
          )}
        </div>
        {isSidebarOpen && (
          <div className="overflow-clip">
            <div className="w-72">
              <h2 className="mb-4 text-2xl font-semibold text-primary">
                Lessons in this Unit
              </h2>
              <ul>
                {unit.lessons.map((lessonItem) => (
                  <li key={lessonItem.id} className="mb-2">
                    <Link
                      href={`/courses/${params.courseId}/${params.unitId}/${lessonItem.id}`}
                      className={`hover:underline ${lessonItem.id === lessonId ? "font-bold" : ""}`}
                    >
                      {lessonItem.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      <div className="flex flex-col lg:flex-row">
        {sidebar}
        <div className="flex-grow">
          {header}
          <div className="container my-16">
            {/* NOTE: Currently only reading and quiz lesson */}
            {lesson?.type === "reading" ? (
              <ReadingLesson
                content={lesson.content}
                isEditing={isEditing}
                onEditToggle={handleEditToggle}
                lesson={lesson}
                setLesson={setLesson}
              />
            ) : (
              <QuizLesson
                lesson={lesson}
                isEditing={isEditing}
                onEditToggle={handleEditToggle}
                setLesson={setLesson}
              />
            )}
            {learningProgress && (
              <div className="progress mt-8">
                <p>Status: {learningProgress.progress}</p>
              </div>
            )}
            {isAdmin && (
              <div className="fixed bottom-24 right-24 z-[100]">
                <button
                  onClick={handleEditToggle}
                  aria-label="edit lesson"
                  className="flex size-16 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-md transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp disabled:cursor-not-allowed disabled:bg-gray-300"
                  disabled={isEditing || !lesson}
                >
                  <span className="text-lg text-white">
                    <MdEdit className="size-8" />
                  </span>
                </button>
              </div>
            )}

            <div className="mt-16 flex justify-between">
              {unit && lesson && unit.lessons && unit.lessons.length > 0 && (
                <>
                  {unit.lessons.findIndex((l) => l.id === lesson.id) > 0 && (
                    <Link
                      href={`/courses/${params.courseId}/${params.unitId}/${unit.lessons[unit.lessons.findIndex((l) => l.id === lesson.id) - 1].id}`}
                      className="rounded-md bg-primary px-4 py-2 text-white"
                    >
                      Previous Lesson
                    </Link>
                  )}
                  {unit.lessons.findIndex((l) => l.id === lesson.id) <
                    unit.lessons.length - 1 && (
                    <Link
                      href={`/courses/${params.courseId}/${params.unitId}/${unit.lessons[unit.lessons.findIndex((l) => l.id === lesson.id) + 1].id}`}
                      className="rounded-md bg-primary px-4 py-2 text-white"
                    >
                      Next Lesson
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
