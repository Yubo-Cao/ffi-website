"use client";

import { Button } from "../ui/button";
import { Lesson } from "@/lib/course";
import { cn } from "@/lib/utils";
import { FileText, Trash2 } from "lucide-react";
import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

interface LessonItemProps {
  lesson: Lesson;
  index: number;
  unitId: string;
  moveLesson: (unitId: string, dragIndex: number, hoverIndex: number) => void;
  onSelectItem: (type: "lesson", data: Lesson) => void;
  selectedItem: {
    type: "unit" | "lesson";
    id: string;
  };
  onDeleteLesson: (lessonId: string) => void;
}

const LessonItem: React.FC<LessonItemProps> = ({
  lesson,
  index,
  unitId,
  selectedItem,
  moveLesson,
  onSelectItem,
  onDeleteLesson,
}) => {
  const ref = useRef<HTMLLIElement>(null);
  const selected =
    selectedItem !== null &&
    selectedItem.type === "lesson" &&
    selectedItem.id === lesson.id;

  const [, drop] = useDrop({
    accept: "LESSON",
    hover(item: { index: number }, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      moveLesson(unitId, dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "LESSON",
    item: { type: "LESSON", id: lesson.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));
  const opacity = isDragging ? 0.5 : 1;

  return (
    <li ref={ref} style={{ opacity }} className="mb-1 group/lesson">
      <div
        className={cn(
          "flex items-center justify-between",
          selected ? "bg-primary/10 rounded-sm" : "",
        )}
      >
        <div
          onClick={() => onSelectItem("lesson", lesson)}
          className={"flex items-center cursor-pointer py-0.5 px-0.5 flex-1"}
        >
          <FileText className="w-4 h-4 mr-2" />
          {lesson.title}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDeleteLesson(lesson.id)}
          className="w-6 h-6 p-0 opacity-0 text-destructive group-hover/lesson:opacity-100"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </li>
  );
};

export default LessonItem;
