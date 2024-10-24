import { LessonProvider } from "@/components/Lesson/LessonProvider";

export default async function LessonLayout(props) {
  const params = await props.params;
  const { children } = props;
  return <LessonProvider params={params}>{children}</LessonProvider>;
}
