import { UnitProgress } from "@/components/Lesson/UnitProgress";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getToken } from "@/lib/auth";
import { getCourse, getCoursesSummary } from "@/lib/course";
import { BookOpen, ChevronRight, GraduationCap } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export const revalidate = 3600;

interface CoursePageProps {
  params: Promise<{
    courseId: string;
  }>;
}

async function CourseContent({ courseId }: { courseId: string }) {
  const course = await getCourse(courseId);
  const tokens = await getToken();

  if (!course || !tokens) {
    notFound();
  }

  return (
    <div className="container py-6 mx-auto header-space">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/courses/${courseId}`}>
              {course.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-6">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
        </div>
        <p className="max-w-2xl mt-2 text-muted-foreground">
          {course.description}
        </p>
      </div>

      <div className="grid gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
        {course.units.map((unit, idx) => {
          const unitLessonIds = unit.lessons.map((lesson) => lesson.id);

          return (
            <Card key={unit.id}>
              <Link href={`/courses/${courseId}/${unit.id}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="w-fit">
                      Unit {idx + 1}
                    </Badge>
                    <BookOpen className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <CardTitle className="mt-2 transition-colors group-hover:text-primary">
                    {unit.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {unit.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UnitProgress
                    unitLessonIds={unitLessonIds}
                    userId={tokens.decodedToken.uid}
                  />
                </CardContent>
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default async function CoursePage({ params }: CoursePageProps) {
  const resolvedParams = await params;

  return (
    <Suspense fallback={<CourseSkeleton />}>
      <CourseContent courseId={resolvedParams.courseId} />
    </Suspense>
  );
}

function CourseSkeleton() {
  return (
    <div className="container py-6 mx-auto header-space">
      <div className="flex items-center gap-2">
        <Skeleton className="w-24 h-4" />
        <Skeleton className="w-4 h-4" />
        <Skeleton className="w-40 h-4" />
      </div>

      <div className="mt-6">
        <div className="flex items-center gap-2">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="w-64 h-8" />
        </div>
        <Skeleton className="h-4 mt-2 w-96" />
      </div>

      <div className="grid gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Skeleton className="w-20 h-5" />
                <Skeleton className="w-5 h-5 rounded-full" />
              </div>
              <Skeleton className="w-48 h-6 mt-2" />
              <Skeleton className="w-full h-4 mt-2" />
              <Skeleton className="w-3/4 h-4 mt-1" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="w-24 h-4" />
                  <Skeleton className="w-20 h-4" />
                </div>
                <Skeleton className="w-full h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const courseSummaries = await getCoursesSummary();

  return courseSummaries.map((summary) => ({
    courseId: summary.id,
  }));
}
