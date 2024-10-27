import { getCoursesSummary, getCourse } from "@/lib/course";
import { MetadataRoute } from "next";

type SitemapEntry = {
  url: string;
  lastModified: Date;
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority: number;
};

async function generateCoursePaths(): Promise<SitemapEntry[]> {
  const courseSummaries = await getCoursesSummary();
  return courseSummaries.map((course) => ({
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/courses/${course.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));
}

async function generateUnitPaths(): Promise<SitemapEntry[]> {
  const courseSummaries = await getCoursesSummary();
  const paths: SitemapEntry[] = [];

  for (const courseSummary of courseSummaries) {
    const course = await getCourse(courseSummary.id);
    for (const unit of course.units) {
      paths.push({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/courses/${course.id}/${unit.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  return paths;
}

async function generateLessonPaths(): Promise<SitemapEntry[]> {
  const courseSummaries = await getCoursesSummary();
  const paths: SitemapEntry[] = [];

  for (const courseSummary of courseSummaries) {
    const course = await getCourse(courseSummary.id);
    for (const unit of course.units) {
      for (const lesson of unit.lessons) {
        paths.push({
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/courses/${course.id}/${unit.id}/${lesson.id}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.6,
        });
      }
    }
  }

  return paths;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: SitemapEntry[] = [
    {
      url: process.env.NEXT_PUBLIC_SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/actions`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/get-involved`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/get-involved/leader`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  try {
    const [coursePaths, unitPaths, lessonPaths] = await Promise.all([
      generateCoursePaths(),
      generateUnitPaths(),
      generateLessonPaths(),
    ]);

    return [...staticRoutes, ...coursePaths, ...unitPaths, ...lessonPaths];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticRoutes;
  }
}
