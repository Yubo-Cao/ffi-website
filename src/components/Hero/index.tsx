"use client";

import Link from "next/link";
import { NAME } from "@/lib/constants";
import Image from "next/image";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6 },
  },
};

const Hero = () => {
  return (
    <motion.section
      id="home"
      className="relative z-10 overflow-hidden bg-white pb-16 pt-32 lg:pt-[calc(80px+8rem)] dark:bg-gray-dark"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <div className="container">
        <div className="-mx-4 flex flex-col-reverse flex-wrap px-4 lg:gap-12 xl:flex-row xl:px-12">
          <motion.div className="max-w-[700px]" variants={containerVariants}>
            <motion.p
              className="text-lg font-semibold md:text-2xl"
              variants={itemVariants}
            >
              {NAME}
            </motion.p>
            <motion.h1
              className="mb-5 text-3xl font-bold leading-tight text-black dark:text-white sm:text-5xl sm:leading-tight md:-ml-1 md:text-6xl md:leading-tight"
              variants={itemVariants}
            >
              Innovating Finance, Shaping Futures
            </motion.h1>
            <motion.p
              className="dark:text-body-color-dark mb-12 text-base !leading-relaxed text-body-color sm:text-lg md:text-xl"
              variants={itemVariants}
            >
              Nonprofit financial education organization that provides free
              financial education to help you make informed decisions about your
              money.
            </motion.p>
            <motion.div
              className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
              variants={containerVariants}
            >
              <motion.div variants={itemVariants}>
                <Link
                  href={"#"}
                  className="bg-primary px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-primary/80"
                >
                  Get Involved
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link
                  href={"#"}
                  className="bg-primary px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-primary/80"
                >
                  Learn More
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
          <motion.div
            className="flex flex-1 items-center justify-center"
            variants={imageVariants}
          >
            <div className="relative -my-8 aspect-square rounded-full p-12 xl:mb-0">
              <Image
                src="/logo.png"
                alt={NAME}
                width={196}
                height={196}
                className="dark:invert"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default Hero;
