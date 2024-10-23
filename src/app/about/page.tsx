import Brands from "@/components/Brands";
import Breadcrumb from "@/components/Common/Breadcrumb";
import SectionTitle from "@/components/Common/SectionTitle";
import Team from "@/components/Team";
import { NAME } from "@/lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `About | ${NAME}`,
  description:
    "Learn more about our mission and commitment to financial education.",
};

const AboutPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="About"
        description="Our mission and commitment to financial education."
      />
      <section id="mission">
        <div className="container">
          <p className="max-w-[800px] leading-loose text-body-color">
            {NAME} aims to empower individuals and communities with the
            knowledge and tools to achieve financial independence and security.
            We are dedicated to providing accessible, comprehensive financial
            education that promotes informed decision-making, responsible money
            management, and long-term wealth-building strategies. Through our
            commitment to inclusivity and innovation, we aim to bridge the
            financial literacy gap, ensuring that everyone has the opportunity
            to build a prosperous future.
          </p>
        </div>
      </section>
      <Team />
      <section id="sponsors" className="pb-16 md:py-20 lg:py-28">
        <div className="container">
          <SectionTitle
            title={"Sponsors"}
            paragraph={`Thank you to our sponsors for supporting ${NAME}`}
            mb="1rem"
          />
          <Brands />
        </div>
      </section>
    </>
  );
};

export default AboutPage;
