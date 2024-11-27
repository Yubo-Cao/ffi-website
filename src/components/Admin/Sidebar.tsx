"use client";

import { Button } from "../ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from "../ui/sidebar";
import UnitItem from "./UnitItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { addUnit, Course, Lesson, removeUnit, Unit } from "@/lib/course";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
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
  onUpdateCourse: (course: Course) => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({
  course,
  selectedItem,
  onSelectItem,
  onReorderUnitsLessons,
  onUpdateCourse,
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

  const handleAddUnit = async () => {
    try {
      const newUnit = await addUnit(course.id, {
        title: "New Unit",
        description: "",
        precedence: course.units.length + 1,
        lessons: [],
      });
      const updatedUnits = [...course.units, newUnit];
      onUpdateCourse({ ...course, units: updatedUnits });
      toast({
        title: "Success",
        description: "Unit added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add unit",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUnit = async (unitId: string) => {
    try {
      await removeUnit(unitId);
      const updatedUnits = course.units.filter((unit) => unit.id !== unitId);
      onUpdateCourse({ ...course, units: updatedUnits });
      toast({
        title: "Success",
        description: "Unit deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete unit",
        variant: "destructive",
      });
    }
  };

  const handleUpdateUnit = (updatedUnit: Unit) => {
    const updatedUnits = course.units.map((unit) =>
      unit.id === updatedUnit.id ? updatedUnit : unit,
    );
    onUpdateCourse({ ...course, units: updatedUnits });
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
            <ScrollArea>
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
                    onDeleteUnit={handleDeleteUnit}
                    onUpdateUnit={handleUpdateUnit}
                  />
                ))}
              </ul>
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button variant="outline" size="sm" onClick={handleAddUnit}>
          <Plus className="w-4 h-4" />
          Add Unit
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
