import Breadcrumb from "@/components/Common/Breadcrumb";
import SingleUnit from "@/components/SingleUnit";
import { getCourse } from "@/lib/course";
import { notFound } from "next/navigation";

export const revalidate = 60;

export default async function CoursePage({
  params,
}: {
  params: { courseId: string };
}) {
  const course = await getCourse(params.courseId);

  if (!course) {
    notFound();
  }

  return (
    <div>
      <Breadcrumb pageName={course.title} description={course.description} />
      <div className="container grid grid-flow-col-dense my-16 mt-12">
        <ol className="grid sm:grid-cols-[repeat(auto-fit,minmax(384px,448px))] gap-4">
          {course.units.map((unit, idx) => (
            <SingleUnit key={unit.id} idx={idx} course={course} unit={unit} />
          ))}
        </ol>
      </div>
    </div>
  );
}
