import Breadcrumb from "@/components/Common/Breadcrumb";
import Opportunities from "@/components/Opportunities";
import WeeklyPosts from "@/components/WeeklyPosts";
import { NAME } from "@/lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Actions | ${NAME}`,
  description: "Our past and upcoming events.",
};

const AboutPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Actions"
        description="Our past and upcoming events."
      />
      <Opportunities center={false} />
      <WeeklyPosts />
    </>
  );
};

export default AboutPage;
