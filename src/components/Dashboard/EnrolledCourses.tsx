"use client";

import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { app, db } from "@/lib/firebase";
import { doc, getDoc } from "@firebase/firestore";

export default function EnrolledCourses() {
  const [courses, setCourses] = useState(null);
  const auth = getAuth(app);
  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userRef = await getDoc(doc(db, "users", user.uid));
        if (userRef.exists()) {
          const userData = userRef.data();
          setCourses(userData.enrolledCourses);
        }
      }
    });
  }, []);

  return (
    <section id="courses" className="container my-16">
      <h2 className="mb-2 text-3xl font-semibold">Enrolled Courses</h2>
      <p className="mb-4 text-body-color">
        Start learning about financial literacy and entrepreneurship by
        enrolling in our courses.
      </p>
      {courses === null ? (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(196px,256px))] gap-4">
          <div className="h-32 animate-pulse rounded-md bg-gray-100 dark:bg-gray-800"></div>
          <div className="h-32 animate-pulse rounded-md bg-gray-100 dark:bg-gray-800"></div>
          <div className="h-32 animate-pulse rounded-md bg-gray-100 dark:bg-gray-800"></div>
        </div>
      ) : courses?.length === 0 || courses === undefined ? (
        <p className="text-body-color">You have not enrolled in any courses.</p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(196px,256px))] gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="flex flex-col rounded-md bg-gray-100 p-4 dark:bg-gray-800"
            >
              <h3 className="text-lg font-semibold">{course.title}</h3>
              <p className="text-sm text-body-color">{course.description}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
