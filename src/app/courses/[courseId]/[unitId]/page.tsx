import UnitPage, { UnitPageProps } from "@/components/Lesson/UnitPage";
import { getCourse, getCoursesSummary } from "@/lib/course";

export default async function Page({ params }: UnitPageProps) {
  return <UnitPage params={params} />;
}

export async function generateStaticParams(): Promise<
  UnitPageProps["params"][]
> {
  const courseSummaries = await getCoursesSummary();
  const paths = [];
  for (const courseSummary of courseSummaries) {
    const course = await getCourse(courseSummary.id);
    for (const unit of course.units) {
      paths.push({
        courseId: course.id,
        unitId: unit.id,
      });
    }
  }
  if (!paths.length || paths.length === 0) {
    return [{ courseId: "no-courses", unitId: "no-units" }];
  }
  return paths;
}
