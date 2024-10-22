"use client";

import useWindowDimensions from "@/components/WeeklyPosts/utils";
import { LOGO, NAME } from "@/lib/constants";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef } from "react";

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
    transition: { type: "spring", duration: 0.6 },
  },
};

const Hero = () => {
  const scrollDown = useCallback(() => {
    document.getElementById("statistics").scrollIntoView({
      behavior: "smooth",
    });
  }, []);
  const heroRef = useRef(null);
  const containerRef = useRef(null);

  const { scrollY, scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });
  const { height, width } = useWindowDimensions();
  const containerWidth = containerRef.current?.offsetWidth || 0;
  const containerHeight = containerRef.current?.offsetHeight || 0;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    console.log(latest, containerWidth, containerHeight, height);
  });

  return (
    <motion.section
      id="home"
      className="z-10 overflow-hidden bg-white pb-16 dark:bg-gray-dark"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <motion.div
        className="h-screen"
        style={{
          display: useTransform(scrollYProgress, (v) =>
            v >= 1 ? "block" : "none",
          ),
        }}
      ></motion.div>
      <motion.div
        className="fixed z-10 left-0 right-0 top-0 bottom-0 w-screen h-screen"
        style={{
          position: useTransform(scrollYProgress, (v) =>
            v >= 1 ? "relative" : "fixed",
          ),
        }}
      >
        <motion.div
          className="absolute top-0 left-0 right-0 bottom-0 z-[100] bg-white opacity-60 flex items-center justify-center"
          style={{
            opacity: useSpring(scrollYProgress, {
              stiffness: 400,
              damping: 90,
            }),
          }}
        >
          <motion.div
            style={{
              scale: useSpring(
                useTransform(scrollYProgress, [0, 0.65], [0.2, 1]),
                {
                  stiffness: 400,
                  damping: 90,
                },
              ),
              translateY: useTransform(
                useTransform(
                  scrollYProgress,
                  [0, 0.65, 1],
                  [
                    width > 1200
                      ? -(containerHeight + 48) / height
                      : 196 / height,
                    width > 1200
                      ? -(containerHeight + 48) / height
                      : 196 / height,
                    1,
                  ],
                ),
                (v) =>
                  width > 1200
                    ? (v * height + containerHeight) / 2 + 48
                    : (v * height - 196) / 2,
              ),
              translateX: useTransform(
                useTransform(
                  scrollYProgress,
                  [0.65, 0.65, 1],
                  [196 / containerWidth, 196 / containerWidth, 1],
                ),
                (v) => (width > 1200 ? (v * containerWidth - 196) / 2 : 0),
              ),
            }}
          >
            <Image
              src={LOGO}
              alt={NAME}
              width={196}
              height={196}
              className="dark:invert"
            />
          </motion.div>
        </motion.div>
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 z-0 object-cover w-full h-full"
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
      </motion.div>
      <motion.div
        className="h-screen"
        style={{
          display: useTransform(scrollYProgress, (v) =>
            v >= 1 ? "none" : "block",
          ),
        }}
      ></motion.div>
      <motion.div
        style={{
          height: useTransform(scrollYProgress, (v) => (v >= 1 ? 1 : "100vh")),
        }}
        ref={heroRef}
      ></motion.div>
      <div className="container mt-12" ref={containerRef}>
        <div className="flex flex-col-reverse flex-wrap px-4 -mx-4 lg:gap-12 xl:flex-row xl:px-12">
          <motion.div
            className="max-w-[700px]"
            variants={containerVariants}
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
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
              We are a student-run nonprofit financial education organization
              that provides free financial education to help young adults make
              informed decisions about their money.
            </motion.p>
            <motion.div
              className="flex flex-wrap items-center gap-4 sm:flex-row"
              variants={containerVariants}
            >
              <motion.div variants={itemVariants}>
                <Link
                  href={"/login"}
                  className="px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out bg-primary hover:bg-primary/80"
                >
                  Start Learning
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <button
                  onClick={scrollDown}
                  className="px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out bg-primary hover:bg-primary/80"
                >
                  Learn More
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default Hero;
