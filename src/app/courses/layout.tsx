import { EditProvider } from "@/components/Lesson/EditProvider";

export default function CourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <EditProvider>{children}</EditProvider>;
}
