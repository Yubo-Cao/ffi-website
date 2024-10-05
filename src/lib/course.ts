"use server";
// ref: https://github.com/vercel/next.js/discussions/51397
// needed for the `unstable_cache` function

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "@firebase/firestore";
import { db } from "@/lib/firebase";
import { unstable_cache } from "next/cache";

export interface Course {
  /**
   * The id of the course.
   */
  id: string;
  /**
   * The title of the course.
   */
  title: string;
  /**
   * The description of the course, in Markdown format.
   */
  description: string;
  /**
   * The units that make up the course.
   */
  units: Unit[];
}

export interface Unit {
  /**
   * The id of the unit.
   */
  id: string;
  /**
   * The title of the unit.
   */
  title: string;
  /**
   * The description of the unit, in Markdown format.
   */
  description: string;
  /**
   * The order, or the precedence, of the unit.
   */
  precedence: number;
  /**
   * The lessons that make up the unit.
   */
  lessons: Lesson[];
}

interface BaseLesson {
  /**
   * The id of the lesson.
   */
  id: string;
  /**
   * The title of the lesson.
   */
  title: string;
  /**
   * The content of the lesson, in Markdown format.
   */
  content: string | null;
  /**
   * The order, or the precedence, of the lesson.
   */
  precedence: number;
  /**
   * The type of the lesson.
   */
  type: "reading" | "video" | "quiz";
}

export interface ReadingLesson extends BaseLesson {
  type: "reading";
}

export interface QuizLesson extends BaseLesson {
  type: "quiz";
  /**
   * The questions that make up the quiz.
   */
  questions: Question[];
}

export type Lesson = ReadingLesson | QuizLesson;

export interface Question {
  /**
   * The question.
   */
  question: string;
  /**
   * The options for the question.
   */
  choices: string[];
  /**
   * The correct answer to the question.
   */
  answer: string;
}

export interface User {
  /**
   * The id of the user.
   */
  id: string;
  /**
   * The email of the user.
   */
  email: string;
  /**
   * The name of the user.
   */
  name: string;
}

export interface Enrollment {
  /**
   * The id of the enrollment.
   */
  id: string;
  /**
   * The course that the enrollment is for.
   */
  courseId: Course["id"];
  /**
   * The user that the enrollment is for.
   */
  userId: User["id"];
  /**
   * The date the enrollment was created.
   */
  createdAt: Date;
}

export interface LearningProgress {
  /**
   * The id of the learning progress.
   */
  id: string;
  /**
   * The user that the learning progress is for.
   */
  userId: User["id"];
  /**
   * The course that the learning progress is for.
   */
  courseId: Course["id"];
  /**
   * The lesson that the learning progress is for.
   */
  lessonId: Lesson["id"];
  /**
   * The progress of the lesson. e.g., completed, in progress, not started. For quiz, it can be the score.
   */
  progress: string;
  /**
   * The date the learning progress was created.
   */
  createdAt: Date;
}

const COURSE_COL = collection(db, "courses");
const UNIT_COL = collection(db, "units");
const LESSON_COL = collection(db, "lessons");
const USER_COL = collection(db, "users");
const ENROLLMENT_COL = collection(db, "enrollments");
const LEARNING_PROGRESS_COL = collection(db, "learningProgress");

async function getCourseImpl(courseId: string): Promise<Course> {
  const course = await getDoc(doc(COURSE_COL, courseId));
  if (!course.exists()) {
    throw new Error("Course not found");
  }
  const courseData = course.data();
  const units = await getDocs(
    query(UNIT_COL, where("course", "==", course.ref), orderBy("precedence")),
  );
  const unitData = await Promise.all(
    units.docs.map(async (unit) => {
      const lessons = await getDocs(
        query(LESSON_COL, where("unit", "==", unit.ref), orderBy("precedence")),
      );
      return {
        id: unit.id,
        title: unit.data().title,
        precedence: unit.data().precedence,
        description: unit.data().description,
        lessons: lessons.docs.map((lesson) => ({
          id: lesson.id,
          title: lesson.data().title,
          precedence: lesson.data().precedence,
          content: lesson.data().content,
          type: lesson.data().type,
        })),
      };
    }),
  );
  return {
    id: course.id,
    title: courseData.title,
    description: courseData.description,
    units: unitData,
  };
}

export interface CourseSummary {
  id: string;
  title: string;
  description: string;
}

const getCourseSummaryImpl = async (
  courseId: string,
): Promise<CourseSummary> => {
  const course = await getDoc(doc(COURSE_COL, courseId));
  if (!course.exists()) {
    throw new Error("Course not found");
  }
  const courseData = course.data();
  return {
    id: course.id,
    title: courseData.title,
    description: courseData.description,
  };
};

export const getCourseSummary = unstable_cache(
  getCourseSummaryImpl,
  ["courses", "getCourseSummary"],
  {
    revalidate: 60 * 60 * 24, // 1 day
  },
);

const getCoursesSummaryImpl = async (): Promise<CourseSummary[]> => {
  const coursesSnapshot = await getDocs(collection(db, "courses"));
  return coursesSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      description: data.description,
    };
  });
};

export const getCoursesSummary = unstable_cache(
  getCoursesSummaryImpl,
  ["courses", "getCoursesSummary"],
  {
    revalidate: 60 * 60 * 24, // 1 day
  },
);

export const getCourse = unstable_cache(
  getCourseImpl,
  ["courses", "getCourse"],
  {
    revalidate: 60 * 60 * 24 * 7, // 1 week
  },
);

async function getUnitImpl(unitId: string): Promise<Unit> {
  const unit = await getDoc(doc(UNIT_COL, unitId));
  if (!unit.exists()) {
    throw new Error("Unit not found");
  }
  const unitData = unit.data();
  const lessons = await getDocs(
    query(LESSON_COL, where("unit", "==", unit.ref), orderBy("precedence")),
  );
  return {
    id: unit.id,
    title: unitData.title,
    precedence: unitData.precedence,
    description: unitData.description,
    lessons: lessons.docs.map((lesson) => ({
      id: lesson.id,
      title: lesson.data().title,
      precedence: lesson.data().precedence,
      content: lesson.data().content,
      type: lesson.data().type,
    })),
  };
}

export const getUnit = unstable_cache(getUnitImpl, ["units", "getUnit"], {
  revalidate: 60 * 60 * 24 * 7, // 1 week
});

const getEnrollmentsImpl = async (userId: string): Promise<Enrollment[]> => {
  const enrollments = await getDocs(
    query(
      collection(db, "enrollments"),
      where("user", "==", doc(USER_COL, userId)),
    ),
  );
  return enrollments.docs.map((enrollment) => ({
    id: enrollment.id,
    courseId: enrollment.data().course.id,
    userId: enrollment.data().user.id,
    createdAt: enrollment.data().createdAt.toDate(),
  }));
};

export const getEnrollments = unstable_cache(
  getEnrollmentsImpl,
  ["enrollments", "getEnrollments"],
  {
    revalidate: 60 * 60 * 24, // 1 day
  },
);

export const enrollCourse = async (
  userId: string,
  courseId: string,
): Promise<Enrollment> => {
  const enrollment = await getDocs(
    query(
      collection(db, "enrollments"),
      where("user", "==", doc(USER_COL, userId)),
      where("course", "==", doc(COURSE_COL, courseId)),
    ),
  );
  if (!enrollment.empty) {
    throw new Error("Already enrolled");
  }
  const enrollmentRef = await addDoc(ENROLLMENT_COL, {
    user: doc(USER_COL, userId),
    course: doc(COURSE_COL, courseId),
    createdAt: new Date(),
  });
  return {
    id: enrollmentRef.id,
    courseId,
    userId,
    createdAt: new Date(),
  };
};

export const ensureEnrolled = async (
  userId: string,
  courseId: string,
): Promise<Enrollment> => {
  const enrollment = await getEnrollments(userId);
  const courseEnrollment = enrollment.find((e) => e.courseId === courseId);
  if (!courseEnrollment) {
    return enrollCourse(userId, courseId);
  }
  return courseEnrollment;
};

const getLearningProgressImpl = async (
  userId: string,
  courseId?: string,
): Promise<LearningProgress[]> => {
  const learningProgress = await getDocs(
    query(
      LEARNING_PROGRESS_COL,
      where("user", "==", doc(USER_COL, userId)),
      ...(courseId ? [where("course", "==", doc(COURSE_COL, courseId))] : []),
    ),
  );
  return learningProgress.docs.map((progress) => ({
    id: progress.id,
    userId: progress.data().user.id,
    courseId: progress.data().course.id,
    lessonId: progress.data().lesson.id,
    progress: progress.data().progress,
    createdAt: progress.data().createdAt.toDate(),
  }));
};

export const getLearningProgress = unstable_cache(
  getLearningProgressImpl,
  ["learningProgress", "getLearningProgress"],
  {
    revalidate: 60 * 60, // 1 hour
  },
);

export async function getLesson(lessonId: string): Promise<Lesson> {
  const lesson = await getDoc(doc(LESSON_COL, lessonId));
  if (!lesson.exists()) {
    throw new Error("Lesson not found");
  }
  const lessonData = lesson.data();
  return {
    id: lesson.id,
    title: lessonData.title,
    content: lessonData.content,
    precedence: lessonData.precedence,
    type: lessonData.type,
    ...(lessonData.type === "quiz" && {
      questions: lessonData.questions,
    }),
  } as Lesson;
}

export const setLesson = async (updatedLesson: Lesson): Promise<void> => {
  const lessonRef = doc(LESSON_COL, updatedLesson.id);
  await updateDoc(lessonRef, {
    title: updatedLesson.title,
    content: updatedLesson.content,
    precedence: updatedLesson.precedence,
    type: updatedLesson.type,
    ...(updatedLesson.type === "quiz" && {
      questions: (updatedLesson as QuizLesson).questions,
    }),
  });
};