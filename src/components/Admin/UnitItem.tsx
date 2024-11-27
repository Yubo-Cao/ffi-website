"use client";

import LessonItem from "./LessonItem";
import { Course, Lesson, Unit } from "@/lib/course";
import { cn } from "@/lib/utils";
import { Folder } from "lucide-react";
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
}

const UnitItem: React.FC<UnitItemProps> = ({
  unit,
  index,
  moveUnit,
  onSelectItem,
  selectedItem,
  moveLesson,
  parentId,
}) => {
  const ref = useRef<HTMLLIElement>(null);
  const selected =
    selectedItem !== null &&
    selectedItem.type === "unit" &&
    selectedItem.id === unit.id;

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
      <div
        onClick={() => onSelectItem(parentId, "unit", unit)}
        className={cn(
          "flex items-center cursor-pointer",
          selected ? "text-primary" : "",
        )}
      >
        <Folder className="w-4 h-4 mr-2" />
        {unit.title}
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
          />
        ))}
      </ul>
    </li>
  );
};

export default UnitItem;
