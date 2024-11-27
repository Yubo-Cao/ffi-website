"use client";

import CourseEditor from "./CourseEditor";
import LessonEditor from "./LessonEditor";
import UnitEditor from "./UnitEditor";
import { Course, Lesson, Unit } from "@/lib/course";
import React from "react";

interface MainContentProps {
  parentId?: string;
  selectedItem: {
    type: "course" | "unit" | "lesson";
    data: Course | Unit | Lesson;
  } | null;
  onUpdateCourse: (course: Course) => void;
  onUpdateUnit: (unit: Unit) => void;
  onUpdateLesson: (lesson: Lesson, unitId: string) => void;
}

const MainContent: React.FC<MainContentProps> = ({
  parentId,
  selectedItem,
  onUpdateCourse,
  onUpdateUnit,
  onUpdateLesson,
}) => {
  if (!selectedItem) {
    return <div className="flex-1 p-4">No item selected</div>;
  }

  switch (selectedItem.type) {
    case "course":
      return (
        <CourseEditor
          course={selectedItem.data as Course}
          onUpdateCourse={onUpdateCourse}
        />
      );
    case "unit":
      return (
        <UnitEditor
          unit={selectedItem.data as Unit}
          onUpdateUnit={onUpdateUnit}
        />
      );
    case "lesson":
      return (
        <LessonEditor
          lesson={selectedItem.data as Lesson}
          onUpdateLesson={(lesson) => onUpdateLesson(lesson, parentId!)}
        />
      );
    default:
      return null;
  }
};

export default MainContent;
