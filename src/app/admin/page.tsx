import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCoursesSummary } from "@/lib/course";
import Link from "next/link";

export default async function Page() {
  const courses = await getCoursesSummary();
  return (
    <main className="container header-space">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/admin`}>Administer Courses</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid gap-6 my-8 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id}>
            <Link href={`/admin/${course.id}`}>
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{course.description}</p>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </main>
  );
}
