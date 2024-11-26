import { LessonContent } from "@/components/Lesson/LessonContent";
import { Skeleton } from "@/components/ui/skeleton";
import { getToken } from "@/lib/auth";
import { getCourse, getCoursesSummary, getLesson, getUnit } from "@/lib/course";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export const revalidate = 3600;
export const dynamicParams = true;

interface LessonPageProps {
  params: Promise<{
    courseId: string;
    unitId: string;
    lessonId: string;
  }>;
}

async function LessonContainer({
  courseId,
  unitId,
  lessonId,
}: {
  courseId: string;
  unitId: string;
  lessonId: string;
}) {
  const [lesson, unit, tokens] = await Promise.all([
    getLesson(lessonId),
    getUnit(unitId),
    getToken(),
  ]);

  if (!lesson || !unit || !tokens) {
    notFound();
  }

  return (
    <LessonContent
      lesson={lesson}
      unit={unit}
      courseId={courseId}
      unitId={unitId}
      lessonId={lessonId}
      userId={tokens.decodedToken.uid}
    />
  );
}

export default async function LessonPage({ params }: LessonPageProps) {
  const resolvedParams = await params;

  return (
    <Suspense fallback={<LessonSkeleton />}>
      <LessonContainer
        courseId={resolvedParams.courseId}
        unitId={resolvedParams.unitId}
        lessonId={resolvedParams.lessonId}
      />
    </Suspense>
  );
}

function LessonSkeleton() {
  return (
    <div className="min-h-screen header-space">
      <div className="sticky top-0 z-50 border-b bg-background">
        <div className="flex items-center justify-between p-4">
          <Skeleton className="w-6 h-6" />
        </div>
        <div className="container py-4">
          <div className="flex items-center gap-2">
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-4 h-4" />
            <Skeleton className="w-32 h-4" />
          </div>
          <Skeleton className="w-64 h-8 mt-2" />
        </div>
      </div>
      <div className="container py-8">
        <Skeleton className="w-full h-64" />
        <div className="flex justify-between mt-8">
          <Skeleton className="w-24 h-10" />
          <Skeleton className="w-24 h-10" />
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({
  params,
}: LessonPageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const [lesson, unit] = await Promise.all([
      getLesson(resolvedParams.lessonId),
      getUnit(resolvedParams.unitId),
    ]);

    const description =
      lesson.content || `Learn about ${lesson.title} in ${unit.title}`;

    return {
      title: `${lesson.title} | ${unit.title}`,
      description,
      openGraph: {
        title: lesson.title,
        description,
        type: "article",
        url: `/courses/${resolvedParams.courseId}/${resolvedParams.unitId}/${resolvedParams.lessonId}`,
      },
      twitter: {
        card: "summary_large_image",
        title: lesson.title,
        description,
      },
    };
  } catch (error) {
    return {
      title: "Lesson Not Found",
      description: "The requested lesson could not be found.",
    };
  }
}

export async function generateStaticParams() {
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
