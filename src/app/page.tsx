import ScrollUp from "@/components/Common/ScrollUp";
import Hero from "@/components/Hero";
import HomeSectionScholarship from "@/components/Home/HomeSectionScholarship";
import HomeSectionSponsors from "@/components/Home/HomeSectionSponsors";
import Opportunities from "@/components/Opportunities";
import Statistics from "@/components/Statistics";
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
      {/*<Opportunities />*/}
      <Statistics />
      {/*<HomeSectionScholarship />*/}
      <HomeSectionSponsors />
    </>
  );
}
