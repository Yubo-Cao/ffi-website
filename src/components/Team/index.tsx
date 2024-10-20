"use client";

import SectionTitle from "@/components/Common/SectionTitle";
import { motion, useAnimationControls } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { MdFace } from "react-icons/md";

type Committee =
  | "executive"
  | "operation"
  | "marketing"
  | "planning"
  | "regionals"
  | "development";

type TeamMember = {
  name: string;
  role: string;
  image?: string;
  bio?: string;
};

const teamMembers: { [key in Committee]: TeamMember[] } = {
  executive: [
    {
      name: "Ian Fernandes",
      role: "President",
    },
    {
      name: "Steven Belder",
      role: "Vice President",
    },
  ],
  operation: [
    {
      name: "Bella Brown",
      role: "Director of Operations",
    },
    {
      name: "William Chow",
      role: "Operations",
    },
    {
      name: "Vynavi Mokkala",
      role: "Operations",
    },
  ],
  marketing: [
    {
      name: "Vander Reeves",
      role: "Director of Marketing/Outreach",
    },
    {
      name: "Nisarg Parekh",
      role: "Marketing/Outreach",
    },
    {
      name: "Ashna Bushan",
      role: "Marketing/Outreach",
    },
    {
      name: "Syma Nisarg",
      role: "Marketing/Outreach",
    },
  ],
  planning: [
    {
      name: "Daniel Neuner",
      role: "Director of Strategic Planning",
    },
  ],
  regionals: [
    {
      name: "Anya Achan",
      role: "Mid-Atlantic Regional Director",
    },
    {
      name: "Evan Trost",
      role: "Southeast Regional Director",
    },
    {
      name: "Harkhush Singh",
      role: "Midwest Regional Director",
    },
  ],
  development: [
    {
      name: "Yubo Cao",
      role: "Director of Technology",
      bio: "Yubo is a senior at Gwinnett School of Mathematics, Science, and Technology. He is passionate about CS and technology. He is the director of technology at the FFI and aims to make an impact on the community through technology, such as building FFI's website and creating platform to financial literacy education.",
    },
    {
      name: "Anish Rachakonda",
      role: "Director of Technology",
    },
  ],
};
const SPRING_TRANSITION = {
  duration: 0.3,
  type: "spring",
  stiffness: 100,
  mass: 0.5,
};
const Member: React.FC<TeamMember> = ({ name, role, image, bio }) => {
  let controls = useAnimationControls();
  const [showBio, setShowBio] = useState(false);

  let img = (
    <Image
      src={image}
      alt={name}
      width={96}
      height={96}
      className="size-24 rounded-full"
    />
  );
  if (!image) {
    img = (
      <div className="flex size-24 items-center justify-center rounded-full bg-primary bg-opacity-10">
        <MdFace className="mx-auto size-16 text-primary" />
      </div>
    );
  }
  useEffect(() => {
    if (showBio) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [showBio, controls]);

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
    >
      {img}
      <h3 className="mt-4 text-lg font-bold">{name}</h3>
      <p className="text-primary">{role}</p>
    </motion.div>
  );
  if (bio) {
    return (
      <>
        <motion.div
          variants={{
            hidden: { opacity: 0, display: "none" },
            visible: {
              opacity: 1,
              display: "block",
              transition: SPRING_TRANSITION,
            },
          }}
          initial="hidden"
          exit="hidden"
          animate={controls}
          className="fixed bottom-0 left-0 right-0 top-0 z-[10000] cursor-pointer bg-black bg-opacity-80 backdrop-blur-sm"
          onClick={() => setShowBio(false)}
        >
          <div className="flex h-full flex-col items-center justify-center gap-4">
            {img}
            <p className="max-w-[600px] text-center leading-loose text-white">
              {bio}
            </p>
          </div>
        </motion.div>
        {core}
      </>
    );
  } else {
    return core;
  }
};

export const Team = () => {
  const [committee, setCommittee] = useState<Committee>("executive");
  const controls = useAnimationControls();

  useEffect(() => {
    controls.start("hidden");
    controls.start("visible");
  }, [committee, controls]);

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
              onClick={async () => {
                setCommittee(key as Committee);
              }}
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
        <motion.div
          className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(196px,256px))] justify-center gap-8"
          variants={{
            hidden: {},
            visible: {
              transition: {
                delayChildren: 0,
                staggerChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          animate={controls}
          viewport={{ once: false, amount: 0.2 }}
          aria-label={`Team members of ${committee} committee`}
        >
          {teamMembers[committee].map((member) => (
            <Member key={member.name} {...member} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Team;
