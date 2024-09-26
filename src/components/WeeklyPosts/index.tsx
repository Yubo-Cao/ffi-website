"use client";

import SectionTitle from "@/components/Common/SectionTitle";
import { NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

export const WeeklyPosts = () => {
  const posts = [
    {
      image: "/images/action/weekly-posts/example1.jpg",
      link: "https://www.instagram.com/p/C8qRUuYAQlD",
    },
    {
      image: "/images/action/weekly-posts/example2.jpg",
      link: "https://www.instagram.com/p/C8lLiJYAb3G",
    },
    {
      image: "/images/action/weekly-posts/example3.jpg",
      link: "https://www.instagram.com/p/C8dp0qVAHzk",
    },
    {
      image: "/images/action/weekly-posts/example4.jpg",
      link: "https://www.instagram.com/p/C8a298dgnHp",
    },
  ];

  const carouselRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      setWidth(
        carouselRef.current.scrollWidth - carouselRef.current.offsetWidth,
      );
    }
  }, []);

  const handlePrev = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <section
      id="weekly-posts"
      className="bg-white py-16 dark:bg-bg-color-dark md:py-20 lg:py-28"
    >
      <div className="container">
        <SectionTitle
          title="Weekly Financial Post"
          paragraph="Stay updated with our weekly financial post."
          mb="1rem"
        />
        <p className="max-w-[800px] leading-loose text-body-color">
          Every week, {NAME} publishes a post on our Instagram and TikTok
          profile to break down financial knowledge into bite-sized pieces.
          Follow us on Instagram and TikTok to stay updated.
        </p>

        {/* Swiper/Recent Post Display with Animation */}
        <div className="relative mt-8">
          <motion.div
            ref={carouselRef}
            className="carousel cursor-grab overflow-hidden"
          >
            <motion.div
              className="inner-carousel flex"
              drag="x"
              dragConstraints={{ right: 0, left: -width }}
            >
              {posts.map((post, index) => (
                <motion.div
                  className="item min-w-[300px] p-2"
                  key={index}
                  whileHover={{ scale: 1.05 }}
                >
                  <Link href={post.link} target="_blank">
                    <Image
                      src={post.image}
                      alt={`Post ${index + 1}`}
                      width={300}
                      height={300}
                      className="rounded-lg"
                    />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 transform rounded-full bg-white dark:bg-slate-700 p-2 shadow-md"
          >
            <MdChevronLeft />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 transform rounded-full bg-white dark:bg-slate-700 p-2 shadow-md"
          >
            <MdChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default WeeklyPosts;
