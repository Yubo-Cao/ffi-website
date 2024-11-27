"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from "../ui/sidebar";
import UnitItem from "./UnitItem";
import { Course, Lesson, Unit } from "@/lib/course";
import { cn } from "@/lib/utils";
import React from "react";

interface AppSidebarProps {
  course: Course;
  onSelectItem: (
    parentId: string | null,
    type: "course" | "unit" | "lesson",
    data: Course | Unit | Lesson,
  ) => void;
  onReorderUnitsLessons: (updatedUnits: Unit[]) => void;
  selectedItem: {
    type: "course" | "unit" | "lesson";
    id: string;
  } | null;
}

const AppSidebar: React.FC<AppSidebarProps> = ({
  course,
  selectedItem,
  onSelectItem,
  onReorderUnitsLessons,
}) => {
  const moveUnit = (dragIndex: number, hoverIndex: number) => {
    const newUnits = [...course.units];
    const [movedUnit] = newUnits.splice(dragIndex, 1);
    newUnits.splice(hoverIndex, 0, movedUnit);
    newUnits.forEach((unit, index) => {
      unit.precedence = index + 1;
    });

    onReorderUnitsLessons(newUnits);
  };

  const moveLesson = (
    unitId: string,
    dragIndex: number,
    hoverIndex: number,
  ) => {
    const updatedUnits = course.units.map((unit) => {
      if (unit.id !== unitId) return unit;
      const newLessons = [...unit.lessons];
      const [movedLesson] = newLessons.splice(dragIndex, 1);
      newLessons.splice(hoverIndex, 0, movedLesson);
      newLessons.forEach((lesson, idx) => {
        lesson.precedence = idx + 1;
      });
      return { ...unit, lessons: newLessons };
    });

    onReorderUnitsLessons(updatedUnits);
  };

  return (
    <Sidebar>
      <div className="header-space"></div>
      <SidebarHeader
        className={cn(
          "mx-4 cursor-pointer ",
          selectedItem?.type === "course" ? "bg-primary/10 rounded-sm" : "",
        )}
      >
        <h2 onClick={() => onSelectItem(null, "course", course)}>
          <span className="text-gray-500">Editing:</span> {course.title}
        </h2>
      </SidebarHeader>
      <SidebarContent className="mx-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <ul>
              {course.units.map((unit, index) => (
                <UnitItem
                  key={unit.id}
                  unit={unit}
                  index={index}
                  moveUnit={moveUnit}
                  onSelectItem={onSelectItem}
                  parentId={course.id}
                  moveLesson={moveLesson}
                  selectedItem={
                    selectedItem.type !== "course"
                      ? (selectedItem as any)
                      : null
                  }
                />
              ))}
            </ul>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
