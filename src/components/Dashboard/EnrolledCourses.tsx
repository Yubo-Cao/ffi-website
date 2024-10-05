"use client";

import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { app, db } from "@/lib/firebase";
import { doc, getDoc } from "@firebase/firestore";
import {
  enrollCourse,
  getCoursesSummary,
  getCourseSummary,
  getEnrollments,
} from "@/lib/course";
import Link from "next/link";

export default function EnrolledCourses() {
  const [courses, setCourses] = useState(null);
  const [allCourses, setAllCourses] = useState(null);
  const auth = getAuth(app);
  const [user, setUser] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        const userRef = await getDoc(doc(db, "users", user.uid));
        if (userRef.exists()) {
          const enrolledCourses = await getEnrollments(user.uid);
          let courseData = await Promise.all(
            enrolledCourses.map((enrollment) =>
              getCourseSummary(enrollment.courseId),
            ),
          );
          setCourses(courseData);
        }
        const availableCourses = await getCoursesSummary();
        setAllCourses(availableCourses.filter((course) => course));
      }
    });
  }, []);

  const handleEnroll = async (courseId) => {
    if (user) {
      try {
        await enrollCourse(user.uid, courseId);
        const userRef = await getDoc(doc(db, "users", user.uid));
        if (userRef.exists()) {
          const userData = userRef.data();
          setCourses(userData.enrolledCourses);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

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
            <Link
              key={course.id}
              className="flex flex-col rounded-md bg-gray-100 p-4 dark:bg-gray-800"
              href={`/courses/${course.id}`}
            >
              <h3 className="text-lg font-semibold">{course.title}</h3>
              <p className="text-sm text-body-color">
                {course.description.substring(0, 100) + "..."}
              </p>
            </Link>
          ))}
        </div>
      )}
      <section
        id="available"
        className={`${
          allCourses?.filter(
            (course) =>
              !courses?.map((course) => course.id).includes(course.id),
          ).length === 0
            ? "hidden"
            : ""
        }`}
      >
        <h2 className="mb-2 mt-12 text-3xl font-semibold">Available Courses</h2>
        <p className="mb-4 text-body-color">
          Enroll in our courses to gain valuable knowledge and skills.
        </p>
        {allCourses === null ? (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(196px,256px))] gap-4">
            <div className="h-32 animate-pulse rounded-md bg-gray-100 dark:bg-gray-800"></div>
            <div className="h-32 animate-pulse rounded-md bg-gray-100 dark:bg-gray-800"></div>
            <div className="h-32 animate-pulse rounded-md bg-gray-100 dark:bg-gray-800"></div>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(196px,256px))] gap-4">
            {allCourses
              .filter(
                (course) =>
                  !courses?.map((course) => course.id).includes(course.id),
              )
              .map((course) => (
                <div
                  key={course.id}
                  className="group flex cursor-pointer flex-col rounded-md bg-gray-100 p-4 transition hover:bg-primary dark:bg-gray-800 dark:hover:bg-primary"
                  onClick={() => handleEnroll(course.id)}
                >
                  <h3 className="text-lg font-semibold group-hover:text-white">
                    {course.title}
                  </h3>
                  <p className="text-sm text-body-color group-hover:text-white">
                    {course.description.substring(0, 100) + "..."}
                  </p>
                </div>
              ))}
          </div>
        )}
      </section>
    </section>
  );
}
