import SectionTitle from "@/components/Common/SectionTitle";
import { NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { MdChevronRight } from "react-icons/md";

export const HomeSectionScholarship = () => {
  return (
    <section id="scholarship" className="relative py-16 md:py-20 lg:py-28">
      <div className="container mx-auto">
        <SectionTitle
          title={"Scholarship Opportunities"}
          paragraph={`${NAME} National Scholars`}
          mb="1rem"
          center
        />
        <Image
          src="/images/hero/scholarship.png"
          alt="Scholarship banner"
          className="-z-10 object-cover brightness-110 saturate-50 dark:brightness-75"
          fill
        />
        <p className="mx-auto mt-4 max-w-[800px] bg-primary bg-opacity-40 p-4 text-center text-lg leading-loose text-white backdrop-blur-2xl">
          {NAME} National Scholars are high school students who have
          demonstrated a passion for finance, investing, and trading. They have
          been recognized for their dedication to financial literacy and have
          been awarded scholarships to continue their education.
        </p>
        <Link
          className="group mx-auto mt-4 block w-fit max-w-40 border border-primary px-5 py-2"
          href="#"
        >
          Learn More
          <MdChevronRight className="ml-2 inline size-5 group-hover:text-primary" />
        </Link>
      </div>
    </section>
  );
};

export default HomeSectionScholarship;
