import ScrollUp from "@/components/Common/ScrollUp";
import Hero from "@/components/Hero";
import { MorningBrew } from "@/components/Home/HomeSectionMorningBrew";
import HomeSectionSponsors from "@/components/Home/HomeSectionSponsors";
import Opportunities from "@/components/Opportunities";
import Statistics from "@/components/Statistics";
import { BASE_URL, DESCRIPTION, NAME } from "@/lib/constants";
import { defaultMetadata } from "@/lib/metadata";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: NAME,
  description: DESCRIPTION,
  alternates: {
    canonical: BASE_URL,
  },
};

export default function Home() {
  return (
    <>
      <ScrollUp />
      <Hero />
      <Opportunities />
      <Statistics />
      {/*<HomeSectionScholarship />*/}
      <MorningBrew />
      <HomeSectionSponsors />
    </>
  );
}
