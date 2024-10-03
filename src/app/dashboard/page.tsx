import Breadcrumb from "@/components/Common/Breadcrumb";

import { NAME } from "@/lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Dashboard | ${NAME}`,
  description: "Learn about financial literacy and entrepreneurship.",
};

const DashboardPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Dashboard"
        description="Learn about financial literacy and entrepreneurship."
      />
    </>
  );
};

export default DashboardPage;
