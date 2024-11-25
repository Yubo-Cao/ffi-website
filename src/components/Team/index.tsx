"use client";

import { teamMembers } from "./teamMembers";
import SectionTitle from "@/components/Common/SectionTitle";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { MdFace } from "react-icons/md";

export type Committee =
  | "executive"
  | "operation"
  | "marketing"
  | "planning"
  | "regionals"
  | "development";

export type TeamMember = {
  name: string;
  role: string;
  image?: string;
  bio?: string;
  altImage?: string;
};

const SPRING_TRANSITION = {
  duration: 0.3,
  type: "spring",
  stiffness: 100,
  mass: 0.5,
};

const Member: React.FC<TeamMember> = ({ name, role, image, bio, altImage }) => {
  const [showBio, setShowBio] = useState(false);

  let img = (
    <Image
      src={image}
      alt={name}
      width={96}
      height={96}
      className="rounded-full bg-primary bg-opacity-10 size-24"
    />
  );
  if (!image) {
    img = (
      <div className="flex items-center justify-center rounded-full size-24 bg-primary bg-opacity-10">
        <MdFace className="mx-auto size-16 text-primary" />
      </div>
    );
  }

  if (bio) {
    img = (
      <div onClick={() => setShowBio(!showBio)} className="cursor-pointer">
        {img}
      </div>
    );
  }
  const core = (
    <motion.div
      className="flex flex-col items-center"
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: SPRING_TRANSITION,
        },
        exit: { opacity: 0, y: 50, transition: { duration: 0.1 } },
      }}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      {img}
      <h3 className="mt-4 text-lg font-bold">{name}</h3>
      <p className="text-primary">{role}</p>
    </motion.div>
  );

  const popUp = (
    <AnimatePresence>
      {bio && showBio && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[10000] cursor-pointer bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowBio(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.3,
            }}
            className="w-full max-w-4xl p-6 bg-white rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-row items-center gap-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="flex-1 aspect-[2/3] bg-gray-300"
              >
                {altImage ? (
                  <Image
                    src={altImage}
                    alt={name}
                    width={416}
                    height={624}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  img
                )}
              </motion.div>
              <div className="flex flex-col flex-1">
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="mb-2 text-2xl font-bold"
                >
                  {name}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  className="mb-4 text-lg text-primary"
                >
                  {role}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  className="text-base leading-loose text-gray-700"
                >
                  {bio}
                </motion.p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (bio && showBio) {
    return (
      <>
        {popUp}
        {core}
      </>
    );
  } else {
    return core;
  }
};

export const Team = () => {
  const [committee, setCommittee] = useState<Committee>("executive");

  return (
    <section id="team" className="py-16 md:py-20 lg:py-28">
      <div className="container">
        <SectionTitle
          title="Meet the Team"
          paragraph="Our team of student leaders is dedicated to promoting financial literacy."
          mb="2.5rem"
        />
        <div className="flex flex-wrap items-center justify-center space-x-4">
          {Object.keys(teamMembers).map((key) => (
            <button
              key={key}
              onClick={() => setCommittee(key as Committee)}
              className={`${
                committee === key
                  ? "font-bold underline underline-offset-8"
                  : ""
              } flex-wrap px-4 py-2 text-primary`}
            >
              {key[0].toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={committee}
            className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(196px,256px))] justify-center gap-8"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  when: "beforeChildren",
                  staggerChildren: 0.1,
                },
              },
            }}
            initial="hidden"
            animate="visible"
            exit="hidden"
            aria-label={`Team members of ${committee} committee`}
          >
            {teamMembers[committee].map((member) => (
              <Member key={member.name} {...member} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex items-center pt-4">
        <Link
          className="inline-block px-5 py-3 mx-auto mt-2 text-lg border font-semi-bold border-primary text-primary"
          href="https://forms.gle/Vz3haWQFYzjff7Gx6"
        >
          Join Now
        </Link>
      </div>
    </section>
  );
};

export default Team;
