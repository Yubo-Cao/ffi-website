import Loader from "@/components/Common/Loader";
import LessonContent, {
  LessonPageProps,
} from "@/components/Lesson/LessonContent";
import { LessonProvider } from "@/components/Lesson/LessonProvider";
import { getCourse, getCoursesSummary, getLesson, getUnit } from "@/lib/course";
import { Metadata } from "next";
import React, { Suspense } from "react";

type Props = {
  params: Promise<{
    courseId: string;
    unitId: string;
    lessonId: string;
  }>;
};

export default async function LessonPage(props: Props) {
  const params = await props.params;
  const initialLesson = await getLesson(params.lessonId);

  return (
    <Suspense fallback={<Loader size={12} />}>
      <LessonProvider initialData={initialLesson} params={params}>
        <LessonContent params={params} />
      </LessonProvider>
    </Suspense>
  );
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  try {
    const params = await props.params;
    const [lesson, unit] = await Promise.all([
      getLesson(params.lessonId),
      getUnit(params.unitId),
    ]);

    return {
      title: `${lesson.title} | ${unit.title}`,
      description:
        lesson.content || `Learn about ${lesson.title} in ${unit.title}`,
      openGraph: {
        title: lesson.title,
        description:
          lesson.content || `Learn about ${lesson.title} in ${unit.title}`,
        type: "article",
        url: `/courses/${params.courseId}/${params.unitId}/${params.lessonId}`,
      },
      twitter: {
        card: "summary_large_image",
        title: lesson.title,
        description:
          lesson.content || `Learn about ${lesson.title} in ${unit.title}`,
      },
    };
  } catch (error) {
    return {
      title: "Lesson Not Found",
      description: "The requested lesson could not be found.",
    };
  }
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
