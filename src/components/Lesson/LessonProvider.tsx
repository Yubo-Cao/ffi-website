"use client";

import { getLesson, Lesson } from "@/lib/course";
import { createContext, useContext } from "react";
import useSWR from "swr";

const LessonContext = createContext<{
  lesson: Lesson;
  setLesson: (lesson: Lesson) => void;
  isLoading: boolean;
  error: Error | null;
}>(null!);

export const LessonProvider = ({
  initialData,
  params,
  children,
}: {
  initialData: Lesson;
  params: any;
  children: React.ReactNode;
}) => {
  const {
    data: lesson,
    isLoading,
    error,
    mutate: setLesson,
  } = useSWR<Lesson>(
    `/lessons/${params.lessonId}`,
    () => getLesson(params.lessonId),
    {
      fallbackData: initialData,
      revalidateOnMount: !initialData,
    },
  );

  return (
    <LessonContext.Provider
      value={{
        lesson: lesson!,
        setLesson,
        isLoading,
        error,
      }}
    >
      {children}
    </LessonContext.Provider>
  );
};

export const useLesson = () => {
  const context = useContext(LessonContext);
  if (context === undefined) {
    throw new Error("useLesson must be used within a LessonProvider");
  }
  return context;
};
