import MainEditor from "@/components/Admin/MainEditor";

export default async function Page({ params }) {
  const courseId = (await params).courseId;

  return <MainEditor courseId={courseId} />;
}
