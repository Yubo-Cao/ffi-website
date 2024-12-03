"use client";

import { useAuth } from "@/components/Common/UserProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  enrollCourse,
  getCoursesSummary,
  getCourseSummary,
  getEnrollments,
} from "@/lib/course";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "@firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CourseCardSkeleton } from "./loading";

interface Course {
  id: string;
  title: string;
  description: string;
}

export default function EnrolledCourses() {
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [allCourses, setAllCourses] = useState<Course[] | null>(null);
  const { user } = useAuth();

  const showCourses =
    allCourses?.filter(
      (course) => !courses?.map((course) => course.id).includes(course.id),
    ) || [];

  useEffect(() => {
    const fetch = async () => {
      if (!user) return;

      const userRef = await getDoc(doc(db, "users", user.uid));
      if (userRef.exists()) {
        const enrolledCourses = await getEnrollments(user.uid);
        const courseData = await Promise.all(
          enrolledCourses.map((enrollment) =>
            getCourseSummary(enrollment.courseId),
          ),
        );
        setCourses(courseData);
      }
      const availableCourses = await getCoursesSummary();
      setAllCourses(availableCourses.filter(Boolean));
    };

    fetch().catch(console.error);
  }, [user]);

  const handleEnroll = async (courseId: string) => {
    if (!user || !courses) return;

    try {
      await enrollCourse(user.uid, courseId);
      const newCourse = await getCourseSummary(courseId);
      setCourses([...courses, newCourse]);
      setAllCourses(
        allCourses?.filter((course) => course.id !== courseId) ?? [],
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <section id="enrolled">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Enrolled Courses
            </h2>
            <p className="text-muted-foreground">
              Start learning about financial literacy and entrepreneurship
            </p>
          </div>
        </div>

        <ScrollArea className="h-full px-1">
          <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2 lg:grid-cols-3">
            {courses === null ? (
              <>
                <CourseCardSkeleton />
                <CourseCardSkeleton />
                <CourseCardSkeleton />
              </>
            ) : courses.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground">
                    You haven't enrolled in any courses yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              courses.map((course) => (
                <Link key={course.id} href={`/courses/${course.id}`}>
                  <Card className="h-full transition-colors hover:bg-muted/50">
                    <CardHeader>
                      <CardTitle>{course.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {course.description.length > 100
                          ? `${course.description.substring(0, 100)}...`
                          : course.description}
                      </p>
                    </CardHeader>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </ScrollArea>
      </section>

      {showCourses.length > 0 && (
        <section id="available" className="mt-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Available Courses
              </h2>
              <p className="text-muted-foreground">
                Enroll in our courses to gain valuable knowledge and skills
              </p>
            </div>
          </div>

          <ScrollArea className="h-full px-1">
            <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2 lg:grid-cols-3">
              {allCourses === null ? (
                <>
                  <CourseCardSkeleton />
                  <CourseCardSkeleton />
                  <CourseCardSkeleton />
                </>
              ) : (
                showCourses.map((course) => (
                  <Card
                    key={course.id}
                    className="transition-colors cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => handleEnroll(course.id)}
                  >
                    <CardHeader>
                      <CardTitle>{course.title}</CardTitle>
                      <p className="text-sm">
                        {course.description.length > 100
                          ? `${course.description.substring(0, 100)}...`
                          : course.description}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full" variant="secondary">
                        Enroll Now
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </section>
      )}
    </>
  );
}
