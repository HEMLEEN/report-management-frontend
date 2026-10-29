"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ScrollMorphHero, { type MorphItem } from "./ScrollMorphHero";
import SkillView from "./SkillView";

export interface SkillGroup { title: string; items: string[] }

interface SkillsSectionProps {
  intro: string;
  groups: SkillGroup[];
  contactHref?: string;
}

const display = { fontFamily: "Anton, 'Bebas Neue', Impact, sans-serif" };

const heroItems: MorphItem[] = [
  { title: "React", label: "Frontend" }, { title: "Node.js", label: "Backend" }, { title: "TypeScript", label: "Language" },
  { title: "Next.js", label: "Frontend" }, { title: "PostgreSQL", label: "Database" }, { title: "MongoDB", label: "Database" },
  { title: "Redis", label: "Cache" }, { title: "Docker", label: "DevOps" }, { title: "AWS", label: "Cloud" },
  { title: "GraphQL", label: "API" }, { title: "Tailwind", label: "Styling" }, { title: "Firebase", label: "Platform" },
];

const skills: any[] = [
  {
    title: "React",
    label: "Frontend Development",
    image: "/images/react-project.jpg",
  },
  {
    title: "TypeScript",
    label: "Programming Language",
    image: "/images/typescript-project.jpg",
  },
  {
    title: "Node.js",
    label: "Backend Development",
    image: "/images/backend-project.jpg",
  },
  {
    title: "MongoDB",
    label: "Database",
    image: "/images/database-project.jpg",
  },
  {
    title: "Next.js",
    label: "Web Framework",
    image: "/images/next-project.jpg",
  },
];

export default function SkillsSection({ intro, groups, contactHref = "#contact" }: SkillsSectionProps) {
  const [open, setOpen] = useState(0);

  return (
    <section id="skills">
      {/* The hero needs a fixed height: it positions cards from the container's measured size */}
      <div className="h-[100svh] min-h-[640px] w-full">
        <SkillView items={skills} title={undefined} />
        {/* <ScrollMorphHero
          items={heroItems}
          title={<>Skills &amp;<br />Technologies</>}
          subtitle={intro}
          introTitle="What I build with"
          introHint="Scroll to explore"
          titleStyle={{ ...display, fontSize: "clamp(2.75rem, 8vw, 6rem)", fontWeight: 400 }}
          cardStyle={display}
        /> */}
      </div>

      {/* Full, accessible list of everything in the hero */}
      {/* <div className="bg-white px-6 py-16 md:px-12">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
          <p className="max-w-xl text-xl font-medium leading-snug md:text-2xl">Everything I work with, by area.</p>
          <motion.a
            href={contactHref}
            whileHover={{ scale: 1.06, backgroundColor: "#14b8a6", color: "#fff", borderColor: "#14b8a6" }}
            className="grid h-28 w-28 shrink-0 place-items-center rounded-full border border-black/40 text-center text-sm font-semibold uppercase leading-tight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          >
            Get in<br />touch
          </motion.a>
        </div>

        <ul className="mt-12">
          {groups.map((g, i) => {
            const isOpen = open === i;
            return (
              <li key={g.title} className="border-t border-dashed border-black/40 last:border-b">
                <button onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen} className="group flex w-full items-center justify-between gap-4 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600">
                  <span style={display} className={`text-[11vw] uppercase leading-none transition-colors duration-300 md:text-[6.5vw] ${isOpen ? "text-teal-600" : "text-black group-hover:text-blue-600"}`}>{g.title}</span>
                  <span className="flex items-center gap-3 text-sm text-black/70">
                    <span className="hidden sm:inline">{g.items.length} tools</span>
                    <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className="grid h-9 w-9 place-items-center rounded-full border border-black/40 text-xl leading-none">+</motion.span>
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }} className="overflow-hidden">
                      <motion.ul initial="h" animate="s" transition={{ staggerChildren: 0.035 }} className="flex flex-wrap gap-2 pb-8">
                        {g.items.map((s) => (
                          <motion.li key={s} variants={{ h: { opacity: 0, y: 10 }, s: { opacity: 1, y: 0 } }} className="rounded-full border border-black/80 px-4 py-1.5 text-sm font-medium transition-colors hover:border-teal-600 hover:bg-teal-600 hover:text-white">{s}</motion.li>
                        ))}
                      </motion.ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div> */}
    </section>
  );
}