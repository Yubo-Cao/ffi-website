"use client";

import { Committee, TeamMember } from ".";

export const teamMembers: {
  [key in Committee]: TeamMember[];
} = {
  executive: [
    {
      name: "Ian Fernandes",
      image: "/images/team/Ian Fernandes.png",
      role: "President",
      bio: "Witnessing a gap in financial literacy among my peers, I recognized how the pandemic reshaped the way we learn. Traditional PowerPoint lectures no longer engage students effectively, and this inspired me to take action. I founded Future Finance Inc. with a mission to empower students to build essential financial skills before entering the real world. Our goal is to inspire the next generation of financial professionals while equipping them with the tools to succeed in a rapidly evolving landscape. At Future Finance Inc., we’re not just teaching finance—we’re shaping the future.",
      altImage: "/images/team/Ian Fernandes Alt.jpeg",
    },
    {
      name: "Steven Belder",
      role: "Vice President",
      image: "/images/team/Steven Belder.png",
      bio: "Future Finance Inc. was founded with the belief that practical financial knowledge is essential for success. Joining FFI with this foundational wisdom in mind, I, together with our team of dedicated student leaders, aim to empower young students with the skills and confidence needed to navigate tomorrow’s challenges, today. By offering engaging, hands-on learning experiences, we go beyond traditional teaching methods to ensure students are prepared for real-world financial challenges. Our mission is to inspire and equip the next generation of financial leaders, shaping a future where financial independence and informed decision-making are within reach for all.",
      altImage: "/images/team/Steven Belder Alt.jpeg",
    },
  ],
  operation: [
    {
      name: "Bella Brown",
      role: "Director of Operations",
      image: "/images/team/Bella Brown.png",
    },
    {
      name: "William Chow",
      role: "Operations",
      image: "/images/team/William Chow.png",
      bio: "Hey! I'm William Chow, a high school senior from Raleigh, NC and I'm super excited to be working on the FFI Operations team. I first got involved with FFI as a state president and have slowly become more interested in helping out at large. I've personally seen financial literacy as something our generation struggles with simply because we don't have the education, something I was fortunate enough to learn from my parents. In my free time I love just about anything sports from playing to watching, especially Duke Basketball or the Carolina Panthers (yikes). I'm also big into graphic design and other journalism type stuff as I'm editor for my school's yearbook. Fun fact about me is I love love love watching Survivor just because I think it's super interesting as a game concept!",
      altImage: "/images/team/William Chow Alt.jpeg",
    },
    // {
    //   name: "Vynavi Mokkala",
    //   role: "Operations",
    // },
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
      name: "Syma Narang",
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
      name: "Harkhush Singh",
      role: "Midwest Regional Director",
      image: "/images/team/Harkhush Singh.png",
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
      role: "Technology",
    },
  ],
};
