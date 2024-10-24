"use client";

import { LOGO, NAME } from "@/lib/constants";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import heroBg from "public/images/hero/hero-bg.jpg";
import { useCallback, useRef } from "react";

const Hero = () => {
  gsap.registerPlugin(ScrollTrigger);

  const scrollDown = useCallback(() => {
    document.getElementById("statistics").scrollIntoView({
      behavior: "smooth",
    });
  }, []);

  const heroRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const heroBgRef = useRef<HTMLImageElement>(null);

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: `+=${window.innerHeight * 5}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const bp = [0, 0.25, 0.5, 0.75, 1];

          const progressBp1 = gsap.utils.clamp(0, bp[1], progress);

          gsap.set(logoRef.current, {
            opacity: gsap.utils.mapRange(0, bp[1], 0, 1, progressBp1),
            scale: gsap.utils.mapRange(0, bp[1], 0.5, 1, progressBp1),
          });
          gsap.set(overlayRef.current, {
            opacity: gsap.utils.mapRange(0, bp[1], 0, 0.5, progressBp1),
            backdropFilter: `blur(${gsap.utils.mapRange(0, bp[1], 0, 10, progressBp1)}px)`,
          });
          gsap.set(heroBgRef.current, {
            scale: gsap.utils.mapRange(0, bp[0], 1, 1.1, progress),
          });

          if (progress <= bp[3]) {
            gsap.to(contentRef.current, {
              opacity: 0,
              x: -20,
              duration: 0.5,
              ease: "power2.out",
            });
          }

          if (progress <= bp[2]) {
            gsap.to(circleRef.current, {
              opacity: 0,
              duration: 0.5,
            });
            gsap.set(circleRef.current, {
              scale: 1,
            });
          }

          if (progress >= bp[3]) {
            gsap.to(contentRef.current, {
              opacity: 1,
              x: 0,
              duration: 0.5,
              ease: "power2.out",
            });
            if (window.innerWidth >= 1200) {
              gsap.to(logoRef.current, {
                x: (contentRef.current.offsetWidth - 700 - 48 * 2) / 2,
                duration: 0.5,
              });
            } else {
              gsap.set(logoRef.current, {
                opacity: 0,
                duration: 0.5,
              });
            }
          } else if (progress >= bp[2]) {
            if (window.innerWidth >= 1200) {
              gsap.set(logoRef.current, {
                x: gsap.utils.mapRange(
                  bp[2],
                  bp[3],
                  0,
                  (contentRef.current.offsetWidth - 700 - 48 * 2) / 2,
                  progress,
                ),
              });
            } else {
              gsap.set(logoRef.current, {
                opacity: gsap.utils.mapRange(bp[2], bp[3], 1, 0, progress),
              });
            }
          } else if (progress >= bp[1]) {
            gsap.set(logoRef.current, {
              x: 0,
            });
            gsap.to(circleRef.current, {
              opacity: 1,
              duration: 0.5,
            });
            gsap.set(circleRef.current, {
              scale: gsap.utils.mapRange(bp[1], bp[2], 1, 20, progress),
            });
          }
        },
      });
      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    { scope: containerRef },
  );

  return (
    <section
      id="home"
      className="z-10 overflow-hidden bg-white pb-16 dark:bg-gray-dark"
      ref={containerRef}
    >
      <div className="h-screen overflow-clip" ref={heroRef}>
        <Image
          src={heroBg}
          alt="Hero Background"
          className="z-0 object-cover object-center"
          ref={heroBgRef}
          fill
        />
        <div
          className="absolute left-0 top-0 right-0 bottom-0 bg-white z-1 opacity-0"
          ref={overlayRef}
        ></div>
        <div
          className="absolute z-0 size-48 bg-white rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 origin-center"
          style={{
            willChange: "transform",
          }}
          ref={circleRef}
        ></div>
        <Image
          src={LOGO}
          alt={NAME}
          ref={logoRef}
          className="z-10 opacity-0 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 origin-center"
          width={198}
          height={198}
        />
        <div
          className="absolute container px-4 xl:px-12 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 opacity-0"
          ref={contentRef}
        >
          <div className="max-w-[700px]">
            <p className="text-lg font-semibold md:text-2xl">{NAME}</p>
            <h1 className="mb-5 text-3xl font-bold leading-tight text-black dark:text-white sm:text-5xl sm:leading-tight md:-ml-1 md:text-6xl md:leading-tight">
              Innovating Finance, Shaping Futures
            </h1>
            <p className="dark:text-body-color-dark mb-4 md:mb-8 xl:mb-12 text-base !leading-relaxed text-body-color sm:text-lg md:text-xl">
              We are a student-run nonprofit financial education organization
              that provides free financial education to help young adults make
              informed decisions about their money.
            </p>
            <div className="flex flex-wrap items-center gap-4 sm:flex-row">
              <Link
                href={"/login"}
                className="px-3 py-2 md:px-5 md:py-3 xl:px-8 xl:py-4 text-base font-semibold text-white duration-300 ease-in-out bg-primary hover:bg-primary/80"
              >
                Start Learning
              </Link>
              <button
                onClick={scrollDown}
                className="px-3 py-2 md:px-5 md:py-3 xl:px-8 xl:py-4 text-base font-semibold text-white duration-300 ease-in-out bg-primary hover:bg-primary/80"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
