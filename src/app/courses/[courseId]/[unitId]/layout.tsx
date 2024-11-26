import { getCourse, getUnit } from "@/lib/course";
import { Metadata } from "next";

interface LayoutProps {
  params: Promise<{
    courseId: string;
    unitId: string;
  }>;
  children: React.ReactNode;
}

export async function generateMetadata(props: LayoutProps): Promise<Metadata> {
  const params = await props.params;
  const course = await getCourse(params.courseId);
  const unit = await getUnit(params.unitId);

  if (!course || !unit) {
    return {
      title: "Unit Not Found",
    };
  }

  return {
    title: `${unit.title} | ${course.title}`,
    description: unit.description,
  };
}

export default function Layout({ children }: LayoutProps) {
  return children;
}
