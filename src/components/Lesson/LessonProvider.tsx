"use client";

import { getLesson, Lesson } from "@/lib/course";
import { createContext, useContext } from "react";
import useSWR from "swr";

const LessonContext = createContext<{
  lesson: Lesson;
  setLesson: (lesson: Lesson) => void;
  isLoading: boolean;
  error: Error | null;
}>({
  lesson: null,
  setLesson: () => {},
  isLoading: false,
  error: null,
});

const LessonProvider = ({ params, children }) => {
  const {
    data: lesson,
    isLoading,
    error,
    mutate: setLesson,
  } = useSWR<Lesson>(`/lessons/${params.lessonId}`, () =>
    getLesson(params.lessonId),
  );

  return (
    <LessonContext.Provider value={{ lesson, setLesson, isLoading, error }}>
      {children}
    </LessonContext.Provider>
  );
};

const useLesson = () => {
  const context = useContext(LessonContext);
  if (context === undefined) {
    throw new Error("useLesson must be used within a LessonProvider");
  }
  return context;
};

export { LessonProvider, useLesson };
