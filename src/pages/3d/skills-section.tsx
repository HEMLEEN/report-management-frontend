"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ImageStreamHero, type StreamImage } from "./image-stream-hero";

export interface SkillGroup { title: string; items: string[] }

interface SkillsSectionProps {
  intro: string;
  groups: SkillGroup[];
  contactHref?: string;
}

const display = { fontFamily: "Anton, 'Bebas Neue', Impact, sans-serif" };

/* Cards in the corridor are generated tiles (SVG data URIs), one per technology,
   in the teal / blue / black / white palette, so no external photos are needed. */
const palette = [
  { bg: ["#2dd4bf", "#2563eb"], fg: "#ffffff", sub: "#ccfbf1" },
  { bg: ["#000000", "#0b1f24"], fg: "#ffffff", sub: "#2dd4bf" },
  { bg: ["#ffffff", "#e2e8f0"], fg: "#000000", sub: "#0f766e" },
  { bg: ["#1d4ed8", "#000000"], fg: "#ffffff", sub: "#5eead4" },
];

function tile(title: string, label: string, i: number): StreamImage {
  const c = palette[i % palette.length];
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 500">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c.bg[0]}"/><stop offset="1" stop-color="${c.bg[1]}"/></linearGradient></defs>` +
    `<rect width="360" height="500" fill="url(#g)"/>` +
    `<circle cx="300" cy="70" r="120" fill="none" stroke="${c.fg}" stroke-opacity=".18" stroke-width="2"/>` +
    `<text x="28" y="48" font-family="Arial,sans-serif" font-size="18" font-weight="700" letter-spacing="4" fill="${c.sub}">${label.toUpperCase()}</text>` +
    `<text x="28" y="460" font-family="Impact,'Arial Black',sans-serif" font-size="${title.length > 8 ? 62 : 78}" fill="${c.fg}">${title.toUpperCase()}</text>` +
    `</svg>`;
  return { src: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`, alt: title };
}

export default function SkillsSection({ intro, groups, contactHref = "#contact" }: SkillsSectionProps) {
  const [open, setOpen] = useState(0);

  const images = [
    tile("React", "Frontend", 0), tile("Node.js", "Backend", 1), tile("TypeScript", "Language", 2),
    tile("Next.js", "Frontend", 3), tile("PostgreSQL", "Database", 0), tile("MongoDB", "Database", 1),
    tile("Redis", "Cache", 2), tile("Docker", "DevOps", 3), tile("AWS", "Cloud", 0),
    tile("GraphQL", "API", 1), tile("Tailwind", "Styling", 2), tile("Firebase", "Platform", 3),
  ];

  return (
    <section id="skills">
      {/* Corridor of technology cards */}
      <div className="p-3 pt-0">
        <ImageStreamHero images={images} axis={58} speed={20} className="h-[78svh] min-h-[520px] rounded-3xl bg-black">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_58%,rgba(20,184,166,0.22),transparent_55%)]" />
          <div className="relative z-10 flex h-full flex-col items-center justify-between px-6 py-10 text-center text-white md:py-14">
            <h2 style={display} className="text-[16vw] uppercase leading-[0.9] md:text-[8vw]">
              Skills &amp;<br />Technologies
            </h2>
            <p className="max-w-md rounded-2xl bg-black/60 px-5 py-3 text-sm leading-relaxed text-white/85 backdrop-blur">{intro}</p>
          </div>
        </ImageStreamHero>
      </div>

      {/* Full, accessible list of everything in the corridor */}
      <div className="bg-white px-6 py-16 md:px-12">
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
      </div>
    </section>
  );
}
