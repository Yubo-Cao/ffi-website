import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CourseCardSkeleton() {
  return (
    <Card className="h-[200px]">
      <CardHeader>
        <Skeleton className="w-1/2 h-6" />
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-4/5 h-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="w-full h-9" />
      </CardContent>
    </Card>
  );
}

export function CoursesSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <CourseCardSkeleton />
      <CourseCardSkeleton />
      <CourseCardSkeleton />
    </div>
  );
}
