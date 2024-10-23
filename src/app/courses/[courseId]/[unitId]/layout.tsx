import { UnitProvider } from "@/components/Lesson/UnitProvider";

export default async function UnitLayout(props) {
  const params = await props.params;

  const {
    children
  } = props;

  return <UnitProvider params={params}>{children}</UnitProvider>;
}
