import ScrollUp from "@/components/Common/ScrollUp";
import Opportunities from "@/components/Opportunities";
import Hero from "@/components/Hero";
import Statistics from "@/components/Statistics";
import HomeSectionScholarship from "@/components/Home/HomeSectionScholarship";
import HomeSectionSponsors from "@/components/Home/HomeSectionSponsors";

import { DESCRIPTION, NAME } from "@/lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: NAME,
  description: DESCRIPTION,
};

export default function Home() {
  return (
    <>
      <ScrollUp />
      <Hero />
      <Opportunities />
      <Statistics />
      <HomeSectionScholarship />
      <HomeSectionSponsors />
    </>
  );
}
