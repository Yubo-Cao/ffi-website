import CoursePage, { CoursePageProps } from "@/components/Lesson/CoursePage";
import { getCoursesSummary } from "@/lib/course";

export default async function Page() {
  return <CoursePage />;
}

export async function generateStaticParams(): Promise<
  CoursePageProps["params"][]
> {
  const courseSummaries = await getCoursesSummary();
  return [
    ...courseSummaries.map((courseSummary) => ({
      courseId: courseSummary.id,
    })),
  ];
}
