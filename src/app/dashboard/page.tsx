import Breadcrumb from "@/components/Common/Breadcrumb";
import EnrolledCourses from "@/components/Dashboard/EnrolledCourses";
import { NAME } from "@/lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Dashboard | ${NAME}`,
  description: "Learn about financial literacy and entrepreneurship.",
};

const DashboardPage = async () => {
  return (
    <>
      <Breadcrumb
        pageName="Dashboard"
        description="Learn about financial literacy and entrepreneurship."
      />
      <EnrolledCourses />
    </>
  );
};

export default DashboardPage;
