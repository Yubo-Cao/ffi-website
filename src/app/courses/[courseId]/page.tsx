import CoursePage, { CoursePageProps } from "@/components/Lesson/CoursePage";
import { getCoursesSummary } from "@/lib/course";

export default async function Page() {
  return <CoursePage />;
}

export async function generateStaticParams(): Promise<
  CoursePageProps["params"][]
> {
  const courseSummaries = await getCoursesSummary();
  const result = [
    ...courseSummaries.map((courseSummary) => ({
      courseId: courseSummary.id,
    })),
  ];
  if (!result.length || result.length === 0) {
    return [{ courseId: "no-courses" }];
  }
  return result;
}
