"use client";

import SectionTitle from "../Common/SectionTitle";
import SingleOpportunity from "./SingleOpportunity";
import opportunitiesData from "./opportunitiesData";
import { NAME } from "@/lib/constants";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const Opportunities = ({ center = true }: { center?: boolean }) => {
  return (
    <>
      <section id="opportunities" className="py-16 md:py-20 lg:py-28">
        <div className="container">
          <SectionTitle
            title="Opportunities"
            paragraph={`${NAME} offers a wide range of opportunities for you to learn about finance, investing, and trading.`}
            center={center}
          />
          <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {opportunitiesData.map((feature) => (
              <motion.div
                key={feature.id}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                <SingleOpportunity feature={feature} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Opportunities;
