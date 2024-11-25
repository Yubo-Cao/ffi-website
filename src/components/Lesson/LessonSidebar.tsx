"use client";

import { useUnit } from "@/components/Lesson/UnitProvider";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import Link from "next/link";

export type LessonSidebarProps = {
  courseId: string;
  unitId: string;
  lessonId: string;
};

export default function LessonSidebar({
  courseId,
  unitId,
  lessonId,
}: LessonSidebarProps) {
  const { unit: data, error, isLoading } = useUnit();

  if (error) {
    return <p>Error: {error.message}</p>;
  }
  if (isLoading || !data) {
    return null;
  }

  return (
    <Sidebar>
      <SidebarContent className="header-space">
        <SidebarGroup>
          <SidebarGroupLabel>{data.title}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.lessons.map((lessonItem) => (
                <SidebarMenuItem key={lessonItem.id}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={`/courses/${courseId}/${unitId}/${lessonItem.id}`}
                    >
                      <span
                        className={
                          lessonItem.id === lessonId ? "font-bold" : ""
                        }
                      >
                        {lessonItem.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
