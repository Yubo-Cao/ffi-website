"use client";

import { SocialLinks } from "@/components/SocialLinks";
import { LOGO, NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <>
      <footer className="relative pt-16 bg-white dark:bg-gray-dark md:pt-20 lg:pt-24">
        <div className="container">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full px-4 md:w-1/2 lg:w-4/12 xl:w-5/12">
              <div className="mb-12 max-w-[128px] lg:mb-16">
                <Link href="/" className="inline-block mb-8">
                  <Image
                    src={LOGO}
                    alt={NAME}
                    className="w-full dark:invert"
                    width={48}
                    height={48}
                  />
                </Link>
                <p className="text-base leading-relaxed dark:text-body-color-dark mb-9 text-body-color">
                  Innovating Finance, Shaping Futures
                </p>
                <SocialLinks />
              </div>
            </div>
            <div className="w-full px-4 sm:w-1/2 md:w-1/2 lg:w-2/12 xl:w-2/12">
              <div className="mb-12 lg:mb-16">
                <h2 className="mb-10 text-xl font-bold text-black dark:text-white">
                  Useful Links
                </h2>
                <ul>
                  <li>
                    <Link
                      href="/"
                      className="inline-block mb-4 text-base duration-300 dark:text-body-color-dark text-body-color hover:text-primary dark:hover:text-primary"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/actions"
                      className="inline-block mb-4 text-base duration-300 dark:text-body-color-dark text-body-color hover:text-primary dark:hover:text-primary"
                    >
                      Actions
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      className="inline-block mb-4 text-base duration-300 dark:text-body-color-dark text-body-color hover:text-primary dark:hover:text-primary"
                    >
                      About
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="w-full px-4 md:w-1/2 lg:w-4/12 xl:w-3/12">
              <div className="mb-12 lg:mb-16">
                <h2 className="mb-10 text-xl font-bold text-black dark:text-white">
                  Get Involved
                </h2>
                <ul>
                  <li>
                    <Link
                      href="/get-involved"
                      className="inline-block mb-4 text-base duration-300 dark:text-body-color-dark text-body-color hover:text-primary dark:hover:text-primary"
                    >
                      Join us as a State Leader
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
