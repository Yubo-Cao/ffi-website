"use client";

import { getCourse, Course } from "@/lib/course";
import { createContext, useContext } from "react";
import useSWR from "swr";

const CourseContext = createContext<{
  course: Course;
  setCourse: (course: Course) => void;
  isLoading: boolean;
  error: Error | null;
}>({
  course: null,
  setCourse: () => {},
  isLoading: false,
  error: null,
});

const CourseProvider = ({ params, children }) => {
  const {
    data: course,
    isLoading,
    error,
    mutate: setCourse,
  } = useSWR<Course>(`/courses/${params.courseId}`, () =>
    getCourse(params.courseId),
  );

  return (
    <CourseContext.Provider value={{ course, setCourse, isLoading, error }}>
      {children}
    </CourseContext.Provider>
  );
};

const useCourse = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error("useCourse must be used within a CourseProvider");
  }
  return context;
};

export { CourseProvider, useCourse };
