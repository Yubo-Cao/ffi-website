"use client";

import { Lesson } from "@/lib/course";
import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";
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
}

const LessonItem: React.FC<LessonItemProps> = ({
  lesson,
  index,
  unitId,
  selectedItem,
  moveLesson,
  onSelectItem,
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
    <li ref={ref} style={{ opacity }} className="mb-1">
      <div
        onClick={() => onSelectItem("lesson", lesson)}
        className={cn(
          "flex items-center cursor-pointer py-0.5 px-0.5",
          selected ? "bg-primary/10 rounded-sm" : "",
        )}
      >
        <FileText className="w-4 h-4 mr-2" />
        {lesson.title}
      </div>
    </li>
  );
};

export default LessonItem;
