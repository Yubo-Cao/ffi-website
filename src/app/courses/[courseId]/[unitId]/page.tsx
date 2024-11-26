import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { clientConfig, serverConfig } from "@/lib/config";
import {
  getCourse,
  getCoursesSummary,
  getLearningProgress,
  getUnit,
} from "@/lib/course";
import { BookOpen, ChevronRight, FileQuestion } from "lucide-react";
import { getTokens } from "next-firebase-auth-edge";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{
    courseId: string;
    unitId: string;
  }>;
}

async function UnitContent({
  courseId,
  unitId,
}: {
  courseId: string;
  unitId: string;
}) {
  const course = await getCourse(courseId);
  const unit = await getUnit(unitId);
  const tokens = await getTokens(await cookies(), {
    apiKey: clientConfig.apiKey,
    cookieName: serverConfig.cookieName,
    cookieSignatureKeys: serverConfig.cookieSignatureKeys,
    serviceAccount: serverConfig.serviceAccount,
  });

  if (!course || !unit || !tokens) {
    notFound();
  }

  const learningProgressList = await getLearningProgress(
    tokens?.decodedToken.uid,
  );
  const progressMap = new Map(
    learningProgressList.map((progress) => [progress.lessonId, progress]),
  );

  const ProgressBadge = ({ progress }: { progress?: string }) => {
    let variant: "default" | "secondary" | "outline" = "outline";
    let label = "Not Started";

    if (progress) {
      if (progress === "Completed") {
        variant = "default";
        label = "Completed";
      } else if (progress === "In Progress") {
        variant = "secondary";
        label = "In Progress";
      }
    }

    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <div className="container py-6 mx-auto header-space">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/courses/${courseId}`}>
              {course.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="w-4 h-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/courses/${courseId}/${unitId}`}>
              {unit.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-6">
        <h1 className="text-3xl font-bold tracking-tight">{unit.title}</h1>
        <p className="mt-2 text-muted-foreground">{unit.description}</p>
      </div>

      <div className="grid gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
        {unit.lessons.map((lesson, index) => {
          const lessonProgress = progressMap.get(lesson.id);

          return (
            <Card key={lesson.id} className="relative group">
              <Link href={`/courses/${courseId}/${unitId}/${lesson.id}`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Lesson {index + 1}</span>
                    {lesson.type === "reading" ? (
                      <BookOpen className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <FileQuestion className="w-5 h-5 text-muted-foreground" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold group-hover:text-primary">
                    {lesson.title}
                  </h3>
                  <div className="flex items-center justify-between mt-4">
                    <ProgressBadge progress={lessonProgress?.progress} />
                  </div>
                </CardContent>
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <Suspense fallback={<UnitSkeleton />}>
      <UnitContent courseId={params.courseId} unitId={params.unitId} />
    </Suspense>
  );
}

function UnitSkeleton() {
  return (
    <div className="container py-6 mx-auto header-space">
      <div className="flex items-center gap-2">
        <Skeleton className="w-24 h-4" />
        <Skeleton className="w-4 h-4" />
        <Skeleton className="w-32 h-4" />
        <Skeleton className="w-4 h-4" />
        <Skeleton className="w-40 h-4" />
      </div>

      <div className="mt-6">
        <Skeleton className="w-64 h-8" />
        <Skeleton className="h-4 mt-2 w-96" />
      </div>

      <div className="grid gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="w-32 h-6" />
            </CardHeader>
            <CardContent>
              <Skeleton className="w-48 h-4" />
              <Skeleton className="w-full h-2 mt-4" />
              <Skeleton className="w-24 h-5 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const courseSummaries = await getCoursesSummary();

  const paths = [];
  for (const summary of courseSummaries) {
    const course = await getCourse(summary.id);
    for (const unit of course.units) {
      paths.push({
        courseId: course.id,
        unitId: unit.id,
      });
    }
  }

  return paths;
}
