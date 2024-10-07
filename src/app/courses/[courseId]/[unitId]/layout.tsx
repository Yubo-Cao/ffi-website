import { UnitProvider } from "@/components/Lesson/UnitProvider";

export default function UnitLayout({ children, params }) {
  return <UnitProvider params={params}>{children}</UnitProvider>;
}
