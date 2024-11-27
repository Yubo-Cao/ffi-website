"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import MainContent from "./MainContent";
import MainEditorSkeleton from "./MainEditorSkeleton";
import AppSidebar from "./Sidebar";
import {
  Course,
  getCourse,
  Lesson,
  setCourse,
  setLesson,
  setUnit,
  Unit,
} from "@/lib/course";
import React, { Suspense, useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface MainEditorProps {
  courseId: string;
}

const MainEditorContent: React.FC<MainEditorProps> = ({ courseId }) => {
  const [course, setCourseState] = useState<Course | null>(null);
  const [parentId, setParentId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<{
    type: "course" | "unit" | "lesson";
    data: Course | Unit | Lesson;
  } | null>(null);

  useEffect(() => {
    async function fetchCourse() {
      const courseData = await getCourse(courseId);
      setCourseState(courseData);
      setSelectedItem({ type: "course", data: courseData });
    }
    fetchCourse();
  }, [courseId]);

  const handleSelectItem = (
    parentId: string | null,
    type: "course" | "unit" | "lesson",
    data: Course | Unit | Lesson,
  ) => {
    setSelectedItem({ type, data });
    setParentId(parentId);
  };

  const handleUpdateCourse = (updatedCourse: Course) => {
    setCourseState(updatedCourse);
    setSelectedItem({ type: "course", data: updatedCourse });
    setCourse(updatedCourse);
  };

  const handleUpdateUnit = (updatedUnit: Unit) => {
    if (!course) return;
    const updatedUnits = course.units.map((unit) =>
      unit.id === updatedUnit.id ? updatedUnit : unit,
    );
    const updatedCourse = { ...course, units: updatedUnits };
    setCourseState(updatedCourse);
    setSelectedItem({ type: "unit", data: updatedUnit });
    setUnit(updatedUnit);
  };

  const handleUpdateLesson = (updatedLesson: Lesson, unitId: string) => {
    if (!course) return;
    const updatedUnits = course.units.map((unit) => {
      if (unit.id !== unitId) return unit;
      const updatedLessons = unit.lessons.map((lesson) =>
        lesson.id === updatedLesson.id ? updatedLesson : lesson,
      );
      return { ...unit, lessons: updatedLessons };
    });
    const updatedCourse = { ...course, units: updatedUnits };
    setCourseState(updatedCourse);
    setSelectedItem({ type: "lesson", data: updatedLesson });
    setLesson(updatedLesson);
  };

  const handleReorderUnitsLessons = (updatedUnits: Unit[]) => {
    if (!course) return;
    const updatedCourse = { ...course, units: updatedUnits };
    setCourseState(updatedCourse);
    updatedUnits.forEach((unit) => {
      setUnit(unit);
      unit.lessons.forEach((lesson) => setLesson(lesson));
    });
  };

  if (!course) {
    return <MainEditorSkeleton />;
  }

  return (
    <SidebarProvider>
      <DndProvider backend={HTML5Backend}>
        <AppSidebar
          course={course}
          onSelectItem={handleSelectItem}
          onReorderUnitsLessons={handleReorderUnitsLessons}
          selectedItem={{
            type: selectedItem?.type,
            id: selectedItem?.data.id,
          }}
        />
      </DndProvider>

      <main className="container w-full pl-4 header-space ">
        <div className="flex flex-row items-center gap-2">
          <SidebarTrigger />

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href={`/admin`}>
                  Administer Courses
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/admin/${courseId}`}>
                  Course "{courseId}"
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <MainContent
          selectedItem={selectedItem}
          onUpdateCourse={handleUpdateCourse}
          onUpdateUnit={handleUpdateUnit}
          onUpdateLesson={handleUpdateLesson}
          parentId={parentId}
          key={selectedItem?.data.id}
        />
      </main>
    </SidebarProvider>
  );
};

const MainEditor: React.FC<MainEditorProps> = ({ courseId }) => {
  return (
    <Suspense fallback={<MainEditorSkeleton />}>
      <MainEditorContent courseId={courseId} />
    </Suspense>
  );
};

export default MainEditor;
