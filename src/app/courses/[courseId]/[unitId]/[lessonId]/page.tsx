import LessonPage, { LessonPageProps } from "@/components/Lesson/LessonPage";
import { getCourse, getCoursesSummary } from "@/lib/course";

export default async function Page({ params }: LessonPageProps) {
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
  if (!paths.length || paths.length === 0) {
    return [
      { courseId: "no-courses", unitId: "no-units", lessonId: "no-lessons" },
    ];
  }
  return paths;
}
