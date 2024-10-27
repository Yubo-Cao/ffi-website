import LessonPage, { LessonPageProps } from "@/components/Lesson/LessonPage";
import { getCourse, getCoursesSummary } from "@/lib/course";

export default async function Page(props: {
  params: Promise<LessonPageProps["params"]>;
}) {
  const params = await props.params;
  return <LessonPage params={params} />;
}

export async function generateStaticParams(): Promise<
  LessonPageProps["params"][]
> {
  const courseSummaries = await getCoursesSummary();
  const paths = [];
  for (const courseSummary of courseSummaries) {
    const course = await getCourse(courseSummary.id);
    for (const unit of course.units) {
      for (const lesson of unit.lessons) {
        paths.push({
          courseId: course.id,
          unitId: unit.id,
          lessonId: lesson.id,
        });
      }
    }
  }
  return paths;
}
