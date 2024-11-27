"use client";

import { Button } from "../ui/button";
import LessonItem from "./LessonItem";
import { toast } from "@/hooks/use-toast";
import { addLesson, Course, Lesson, removeLesson, Unit } from "@/lib/course";
import { cn } from "@/lib/utils";
import { Folder, Plus, Trash2 } from "lucide-react";
import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

interface UnitItemProps {
  unit: Unit;
  index: number;
  moveUnit: (dragIndex: number, hoverIndex: number) => void;
  onSelectItem: (
    parentId: string | null,
    type: "unit" | "lesson",
    data: Unit | Lesson,
  ) => void;
  selectedItem: {
    type: "unit" | "lesson";
    id: string;
  };
  moveLesson: (unitId: string, dragIndex: number, hoverIndex: number) => void;
  parentId: string;
  onDeleteUnit: (unitId: string) => void;
  onUpdateUnit: (unit: Unit) => void;
}

const UnitItem: React.FC<UnitItemProps> = ({
  unit,
  index,
  moveUnit,
  onSelectItem,
  selectedItem,
  moveLesson,
  parentId,
  onDeleteUnit,
  onUpdateUnit,
}) => {
  const ref = useRef<HTMLLIElement>(null);
  const selected =
    selectedItem !== null &&
    selectedItem.type === "unit" &&
    selectedItem.id === unit.id;

  const handleAddLesson = async () => {
    try {
      const newLesson = await addLesson(unit.id, {
        title: "New Lesson",
        content: "",
        precedence: unit.lessons.length + 1,
        type: "reading",
      });
      const updatedUnit = {
        ...unit,
        lessons: [...unit.lessons, newLesson],
      };
      onUpdateUnit(updatedUnit);
      onSelectItem(parentId, "unit", updatedUnit);
      toast({
        title: "Success",
        description: "Lesson added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add lesson",
        variant: "destructive",
      });
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    try {
      await removeLesson(lessonId);
      const updatedLessons = unit.lessons.filter(
        (lesson) => lesson.id !== lessonId,
      );
      const updatedUnit = { ...unit, lessons: updatedLessons };
      onUpdateUnit(updatedUnit);
      onSelectItem(parentId, "unit", updatedUnit);
      toast({
        title: "Success",
        description: "Lesson deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete lesson",
        variant: "destructive",
      });
    }
  };

  const [, drop] = useDrop({
    accept: "UNIT",
    hover(item: { index: number }, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      moveUnit(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "UNIT",
    item: { type: "UNIT", id: unit.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));
  const opacity = isDragging ? 0.5 : 1;

  return (
    <li ref={ref} style={{ opacity }} className="mb-2">
      <div className="flex items-center justify-between">
        <div
          onClick={() => onSelectItem(parentId, "unit", unit)}
          className={cn(
            "flex items-center cursor-pointer flex-1",
            selected ? "text-primary" : "",
          )}
        >
          <Folder className="w-4 h-4 mr-2" />
          {unit.title}
        </div>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAddLesson}
            className="w-6 h-6 p-0"
          >
            <Plus className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDeleteUnit(unit.id)}
            className="w-6 h-6 p-0 text-destructive"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
      <ul className="pt-2 ml-2">
        {unit.lessons.map((lesson, idx) => (
          <LessonItem
            key={lesson.id}
            lesson={lesson}
            index={idx}
            unitId={unit.id}
            moveLesson={moveLesson}
            selectedItem={selectedItem}
            onSelectItem={() => onSelectItem(unit.id, "lesson", lesson)}
            onDeleteLesson={handleDeleteLesson}
          />
        ))}
      </ul>
    </li>
  );
};

export default UnitItem;
