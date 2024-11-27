"use client";

import MainContent from "./MainContent";
import MainEditorSkeleton from "./MainEditorSkeleton";
import AppSidebar from "./Sidebar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();
  const [course, setCourseState] = useState<Course | null>(null);
  const [parentId, setParentId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<{
    type: "course" | "unit" | "lesson";
    data: Course | Unit | Lesson;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const courseData = await getCourse(courseId);
        setCourseState(courseData);
        setSelectedItem({ type: "course", data: courseData });
        setError(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load course";
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Error Loading Course",
          description: errorMessage,
        });
      }
    }
    fetchCourse();
  }, [courseId, toast]);

  const handleSelectItem = (
    parentId: string | null,
    type: "course" | "unit" | "lesson",
    data: Course | Unit | Lesson,
  ) => {
    try {
      setSelectedItem({ type, data });
      setParentId(parentId);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to select item";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error Selecting Item",
        description: errorMessage,
      });
    }
  };

  const handleUpdateCourse = async (updatedCourse: Course) => {
    try {
      setCourseState(updatedCourse);
      setSelectedItem({ type: "course", data: updatedCourse });
      await setCourse(updatedCourse);
      setError(null);
      toast({
        title: "Course Updated",
        description: "Course has been successfully updated",
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update course";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error Updating Course",
        description: errorMessage,
      });
    }
  };

  const handleUpdateUnit = async (updatedUnit: Unit) => {
    if (!course) return;
    try {
      const updatedUnits = course.units.map((unit) =>
        unit.id === updatedUnit.id ? updatedUnit : unit,
      );
      const updatedCourse = { ...course, units: updatedUnits };
      setCourseState(updatedCourse);
      setSelectedItem({ type: "unit", data: updatedUnit });
      await setUnit(updatedUnit);
      setError(null);
      toast({
        title: "Unit Updated",
        description: "Unit has been successfully updated",
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update unit";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error Updating Unit",
        description: errorMessage,
      });
    }
  };

  const handleUpdateLesson = async (updatedLesson: Lesson, unitId: string) => {
    if (!course) return;
    try {
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
      await setLesson(updatedLesson);
      setError(null);
      toast({
        title: "Lesson Updated",
        description: "Lesson has been successfully updated",
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update lesson";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error Updating Lesson",
        description: errorMessage,
      });
    }
  };

  const handleReorderUnitsLessons = async (updatedUnits: Unit[]) => {
    if (!course) return;
    try {
      const updatedCourse = { ...course, units: updatedUnits };
      setCourseState(updatedCourse);

      for (const unit of updatedUnits) {
        await setUnit(unit);
        for (const lesson of unit.lessons) {
          await setLesson(lesson);
        }
      }

      setError(null);
      toast({
        title: "Order Updated",
        description: "Course structure has been successfully reordered",
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to reorder items";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error Reordering Items",
        description: errorMessage,
      });
    }
  };

  if (!course && !error) {
    return <MainEditorSkeleton />;
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <DndProvider backend={HTML5Backend}>
        <AppSidebar
          course={course!}
          onSelectItem={handleSelectItem}
          onReorderUnitsLessons={handleReorderUnitsLessons}
          selectedItem={{
            type: selectedItem?.type,
            id: selectedItem?.data.id,
          }}
        />
      </DndProvider>

      <main className="container w-full pl-4 header-space">
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

      <Toaster />
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
