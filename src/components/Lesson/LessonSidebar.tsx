"use client";

import { useUnit } from "@/components/Lesson/UnitProvider";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

export type LessonSidebar = {
  courseId: string;
  unitId: string;
  lessonId: string;
};

export default function LessonSidebar({
  courseId,
  unitId,
  lessonId,
}: LessonSidebar) {
  const { unit: data, error, isLoading } = useUnit();
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (error) {
    return <p>Error: {error.message}</p>;
  }
  if (isLoading) {
    return;
  }

  const handleDrag = (event, info) => {
    const newWidth = sidebarWidth + info.delta.x;
    if (newWidth < 40) {
      setIsCollapsed(true);
      setSidebarWidth(0);
    } else {
      setIsCollapsed(false);
      setSidebarWidth(newWidth);
    }
  };

  return (
    <motion.div
      className={`relative hidden border-r-2 border-primary p-6 pt-[120px] sm:pt-[180px] lg:pt-[206px] 2xl:block`}
      style={{ width: isCollapsed ? 0 : sidebarWidth }}
    >
      <div
        className="absolute -right-6 top-1/2 -translate-y-1/2 transform cursor-pointer rounded-full bg-gray-200 p-2 hover:bg-opacity-80 dark:bg-gray-700"
        onClick={() => {
          setIsCollapsed(!isCollapsed);
          setSidebarWidth(300);
        }}
      >
        {isCollapsed ? (
          <MdChevronRight size={24} />
        ) : (
          <MdChevronLeft size={24} />
        )}
      </div>

      {!isCollapsed && (
        <div className="overflow-clip">
          <div className="w-full">
            {isLoading ? (
              <h2 className="mb-4 h-4 bg-gray-200 dark:bg-gray-800 animate-pulse"></h2>
            ) : (
              <h2 className="mb-4 text-2xl font-semibold text-primary">
                {data.title}
              </h2>
            )}
            {isLoading ? (
              <ul>
                {[1, 2, 3].map((index) => (
                  <li
                    className="mb-2 h-4 bg-gray-200 dark:bg-gray-800 animate-pulse"
                    key={index}
                  ></li>
                ))}
              </ul>
            ) : (
              <ul>
                {data.lessons.map((lessonItem) => (
                  <li key={lessonItem.id} className="mb-2 flex items-center">
                    <Link
                      href={`/courses/${courseId}/${unitId}/${lessonItem.id}`}
                      className={`hover:underline ${
                        lessonItem.id === lessonId ? "font-bold" : ""
                      }`}
                    >
                      {lessonItem.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Resizable handle */}
      <motion.div
        className="absolute right-0 top-0 h-full w-1 cursor-col-resize bg-transparent"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDrag={handleDrag}
        dragElastic={0}
      />
    </motion.div>
  );
}
