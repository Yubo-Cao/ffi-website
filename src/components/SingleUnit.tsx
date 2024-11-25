import { Course, Unit } from "@/lib/course";
import Link from "next/link";

type SingleUnitProps = {
  idx: number;
  course: Course;
  unit: Unit;
};

export default function SingleUnit({ idx, course, unit }: SingleUnitProps) {
  return (
    <Link href={`/courses/${course.id}/${unit.id}`}>
      <li className="relative max-w-xl p-4 bg-gray-100 rounded-lg dark:bg-gray-800 size-full">
        <h2 className="mb-2 text-lg font-semibold text-body-color">
          <span className="text-xl text-black dark:text-white">
            Unit {idx + 1}.
          </span>{" "}
          {unit.title}
        </h2>
        <ul className="flex flex-row gap-2">
          {unit.lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="bg-gray-200 rounded-md size-8 dark:bg-gray-700"
            ></div>
          ))}
        </ul>
      </li>
    </Link>
  );
}
