import { CourseProvider } from "@/components/Lesson/CourseProvider";
import { ReactNode } from "react";

export default function CourseLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { courseId: string };
}) {
  return <CourseProvider params={params}>{children}</CourseProvider>;
}
