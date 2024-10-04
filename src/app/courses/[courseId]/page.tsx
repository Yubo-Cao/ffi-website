"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "@firebase/firestore";
import { db } from "@/lib/firebase";

type CoursePageProps = {
  params: {
    courseId: string;
  };
};

type Course = {
  description: string;
  title: string;
};

type Unit = {
  title: string;
  description: string;
  lessons: [];
};

export default function CoursePage({ params }: CoursePageProps) {
  const courseId = params.courseId;
  const [course, setCourse] = useState<Course>(null);
  const [units, setUnits] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const fetch = async () => {
      const course = await getDoc(doc(db, "courses", courseId));
      setCourse(course.data() as Course);
      const units = await getDocs(
        query(
          collection(db, "units"),
          where("course", "==", course.ref),
          orderBy("precedence"),
        ),
      );
      const results: Unit[] = [];
      for (const unit of units.docs) {
        const lessons = await getDocs(
          query(
            collection(db, "lessons"),
            where("unit", "==", unit.ref),
            orderBy("precedence"),
          ),
        );
        results.push({
          ...unit.data(),
          lessons: lessons.docs.map((lesson) => lesson.data()),
        } as Unit);
      }
      setUnits(results);
    };
    fetch().catch((e) => {
      setStatus("error");
      console.error(e);
    });
  }, [courseId]);

  const header = (
    <Breadcrumb
      pageName={`${course?.title || "<LOADING>"}`}
      description={course?.description || "<LOADING>"}
    />
  );

  if (status == "error") {
    return (
      <div>
        {header}
        <h1>Course not found</h1>
      </div>
    );
  }

  return (
    <div>
      {header}
      <div className="container grid grid-flow-col-dense my-24">
        <ol>
          {units.map((unit, idx) => (
            <li
              key={unit.title}
              className="max-w-xl p-4 bg-gray-100 rounded-lg dark:bg-gray-800"
            >
              <h2 className="mb-2 text-lg font-semibold text-body-color">
                <span className="text-xl text-black dark:text-white">
                  Unit {idx + 1}.
                </span>{" "}
                {unit.title}
              </h2>
              <ul className="flex flex-row gap-2">
                {unit.lessons.map((lesson) => (
                  <div className="rounded-md size-8 bg-primary"></div>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
