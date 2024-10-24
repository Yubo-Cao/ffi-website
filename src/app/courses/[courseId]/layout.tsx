import { CourseProvider } from "@/components/Lesson/CourseProvider";
import { ReactNode } from "react";

export default async function CourseLayout(props: {
  children: ReactNode;
  params: Promise<{ courseId: string }>;
}) {
  const params = await props.params;

  const { children } = props;

  return <CourseProvider params={params}>{children}</CourseProvider>;
}
