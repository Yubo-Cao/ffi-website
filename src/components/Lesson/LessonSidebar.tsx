"use client";

import { useEdit } from "@/components/Lesson/EditProvider";
import { useUnit } from "@/components/Lesson/UnitProvider";
import { addLesson, updateLessonTitle } from "@/lib/course";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdChevronLeft, MdChevronRight, MdDelete } from "react-icons/md";

export type LessonSidebar = {
  courseId: string;
  unitId: string;
  lessonId: string;
};

export default function LessonSidebar({
  courseId,
  unitId,
  lessonId,
}: LessonSidebar) {
  const { unit: data, error, isLoading, setUnit } = useUnit();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isEditing, setIsEditing } = useEdit();
  const [lessonTitles, setLessonTitles] = useState<Map<string, string>>(
    new Map(),
  );

  useEffect(() => {
    if (data) {
      const lessonTitles = new Map<string, string>();
      data.lessons.forEach((lesson) => {
        lessonTitles.set(lesson.id, lesson.title);
      });
      setLessonTitles(lessonTitles);
    }
  }, [data]);

  if (error) {
    return <p>Error: {error.message}</p>;
  }
  if (isLoading) {
    return;
  }

  const addOneLesson = async () => {
    const newLesson = await addLesson(unitId, {
      title: "New Lesson",
      type: "reading",
      precedence: [...data.lessons.map((l) => l.precedence), 0].sort()[0] + 10,
      content: "",
    });
    setUnit({
      ...data,
      lessons: [...data.lessons, newLesson],
    });
  };

  const removeLesson = async (lessonId: string) => {
    await removeLesson(lessonId);
    setUnit({
      ...data,
      lessons: data.lessons.filter((l) => l.id !== lessonId),
    });
  };

  const changeLessonTitle = (lessonId: string, title: string) => {
    setLessonTitles(new Map(lessonTitles.set(lessonId, title)));
  };

  const save = async () => {
    for (const [lessonId, title] of lessonTitles) {
      await updateLessonTitle(lessonId, title);
    }
    setIsEditing(false);
  };

  return (
    <div
      className={`transition-all duration-300 ease-in-out ${
        sidebarOpen ? "w-[400px]" : "w-12"
      } relative hidden border-r-2 border-primary p-6 pt-[120px] sm:pt-[180px] lg:pt-[206px] 2xl:block`}
    >
      <div
        className="absolute -right-6 top-1/2 -translate-y-1/2 transform cursor-pointer rounded-full bg-gray-200 p-2 hover:bg-opacity-80 dark:bg-gray-700"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? (
          <MdChevronLeft size={24} />
        ) : (
          <MdChevronRight size={24} />
        )}
      </div>

      {sidebarOpen && (
        <div className="overflow-clip">
          <div className="w-96">
            {isLoading ? (
              <h2 className="mb-4 h-4 bg-gray-200 dark:bg-gray-800 animate-pulse"></h2>
            ) : (
              <h2 className="mb-4 text-2xl font-semibold text-primary">
                {data.title}
              </h2>
            )}
            {isLoading ? (
              <ul>
                {[1, 2, 3].map((index) => (
                  <li
                    className="mb-2 h-4 bg-gray-200 dark:bg-gray-800 animate-pulse"
                    key={index}
                  ></li>
                ))}
              </ul>
            ) : (
              <ul>
                {data.lessons.map((lessonItem) => (
                  <li key={lessonItem.id} className="mb-2 flex items-center">
                    {isEditing ? (
                      <input
                        type="text"
                        value={lessonTitles.get(lessonItem.id)}
                        onChange={(e) =>
                          changeLessonTitle(lessonItem.id, e.target.value)
                        }
                        className="w-3/4"
                      />
                    ) : (
                      <Link
                        href={`/courses/${courseId}/${unitId}/${lessonItem.id}`}
                        className={`hover:underline ${lessonItem.id === lessonId ? "font-bold" : ""}`}
                      >
                        {lessonItem.title}
                      </Link>
                    )}
                    {isEditing && (
                      <button
                        onClick={() => removeLesson(lessonItem.id)}
                        className="ml-2 text-red-500"
                      >
                        <MdDelete size={20} />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {isEditing && (
              <div className="flex gap-2 items-center">
                <button
                  onClick={save}
                  className="bg-primary text-white py-2 px-4 rounded-md hover:bg-opacity-80"
                >
                  Save Lessons
                </button>
                <button
                  onClick={addOneLesson}
                  className="bg-primary text-white py-2 px-4 rounded-md hover:bg-opacity-80"
                >
                  Add lesson
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
