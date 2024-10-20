import SectionTitle from "@/components/Common/SectionTitle";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export function MorningBrew() {
  return (
    <section className="container py-16 md:py-20 lg:py-28" id="homebrew">
      <SectionTitle
        title={"Morning Brew"}
        paragraph={
          "Morning Brew is a free daily newsletter that delivers the latest news from Wall Street to Silicon Valley. Signup for free today!"
        }
        mb="32px"
        center
      />
      <Link
        href="https://www.morningbrew.com/daily/r?kid=ca4e6239"
        target="_blank"
        className="flex gap-2 items-center px-6 text-lg py-3 justify-center border-primary border-2 leading-[48px] w-fit mx-auto"
      >
        Subscribe to
        <Image
          src={"/images/morning-brew.png"}
          alt={"Morning Brew"}
          width={200}
          height={49.98}
          className={"mr-4 leading-[48px] dark:hidden"}
        />
        <Image
          src={"/images/morning-brew-dark.png"}
          alt={"Morning Brew"}
          width={200}
          height={49.98}
          className={"mr-4 leading-[48px] hidden dark:inline"}
        />
      </Link>
    </section>
  );
}
