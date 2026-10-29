import { useEffect, useRef } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ImageStreamHero, type StreamImage } from "./image-stream-hero";
import SkillsSection from "./skills-section";
import PerspectiveTunnelHero, { type TunnelItem } from "./perspective-tunnel-hero";

/* ---------- Data ---------- */
const profile = {
  name: "Hemleen Francis",
  role: "Full-Stack Developer",
  tagline: "Passionate about creating beautiful, functional, and user-centered digital experiences",
  email: "hemleen7@gmail.com",
  phone: "+91 9629817352",
  location: "Coimbatore, Tamilnadu",
  response: "I typically respond to emails within 24 hours. For urgent matters, feel free to reach out via phone.",
};
const journey = [
  "Started my coding journey in 2018 and have been building web applications ever since. I specialize in React, Node.js, and modern web technologies.",
  "When I'm not coding, you can find me exploring new technologies, contributing to open source projects, or sharing knowledge with the developer community.",
];
const belief = "I believe in writing code that not only works but is also maintainable, scalable, and brings value to users.";
const skillIntro = "I work with a variety of technologies to bring ideas to life. Here are some of the tools and frameworks I'm proficient in.";
const skillGroups = [
  { title: "Frontend", items: ["React", "Next.js", "TypeScript", "Redux", "Tailwind CSS", "Bootstrap", "Framer Motion", "Vue.js", "Vuex"] },
  { title: "Backend & Database", items: ["Node.js", "Express", "TypeScript", "Oracle", "MySQL", "PostgreSQL", "MongoDB", "Redis"] },
  { title: "Cache & Performance", items: ["Redis", "RedisInsight", "Multer"] },
  { title: "DevOps Technologies", items: ["Git", "Docker", "AWS", "Vercel", "Figma", "VS Code"] },
  { title: "Other Technologies", items: ["GraphQL", "Jest", "Webpack", "Sass", "Material-UI", "Semantic-UI", "Firebase", "Stripe", "Socket.io"] },
];
const tunnelItems: TunnelItem[] = [
  { title: "React", label: "Frontend" },
  { title: "Node.js", label: "Backend" },
  { title: "TypeScript", label: "Language" },
  { title: "Next.js", label: "Frontend" },
  { title: "PostgreSQL", label: "Database" },
  { title: "Redis", label: "Cache" },
  { title: "Docker", label: "DevOps" },
  { title: "AWS", label: "Cloud" },
  { title: "GraphQL", label: "API" },
];

/* Skill tiles drawn as inline SVG, so the corridor needs no external images */
const tileStyles = [
  { a: "#2dd4bf", b: "#2563eb", c: "#ffffff" },
  { a: "#000000", b: "#0b1f2a", c: "#5eead4" },
  { a: "#ffffff", b: "#e2e8f0", c: "#000000" },
  { a: "#2563eb", b: "#000000", c: "#ffffff" },
];
function skillTile(title: string, label: string, i: number): StreamImage {
  const t = tileStyles[i % tileStyles.length];
  const size = Math.min(64, Math.floor(304 / (title.length * 0.52)));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 500"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${t.a}"/><stop offset="1" stop-color="${t.b}"/></linearGradient></defs><rect width="360" height="500" fill="url(#g)"/><text x="28" y="56" font-family="Arial,sans-serif" font-size="20" font-weight="700" letter-spacing="4" fill="${t.c}" opacity="0.7">${label.toUpperCase()}</text><text x="28" y="468" font-family="Impact,'Arial Narrow',sans-serif" font-size="${size}" fill="${t.c}">${title.toUpperCase()}</text></svg>`;
  return { src: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`, alt: title };
}
const skillTiles: StreamImage[] = [
  ["React", "Frontend"], ["Node.js", "Backend"], ["TypeScript", "Language"], ["Next.js", "Frontend"],
  ["PostgreSQL", "Database"], ["Tailwind CSS", "Styling"], ["Redis", "Cache"], ["Docker", "DevOps"],
  ["MongoDB", "Database"], ["AWS", "Cloud"], ["GraphQL", "API"], ["Socket.io", "Realtime"],
].map(([t, l], i) => skillTile(t, l, i));
const principles = ["Maintainable", "Scalable", "Valuable"];
const nav = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

const display = { fontFamily: "Anton, 'Bebas Neue', Impact, sans-serif" };
const TEAL = "#14b8a6";
const BLUE = "#2563eb";

/* ---------- 3D cube ---------- */
function Cube({ faces, size = 200, from = TEAL, to = BLUE }: { faces: string[]; size?: number; from?: string; to?: string }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 70, damping: 16 });
  const sy = useSpring(my, { stiffness: 70, damping: 16 });
  const ry = useTransform(sx, (v) => v * 25);
  const rx = useTransform(sy, (v) => v * -18);
  useEffect(() => {
    const h = (e: MouseEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 2);
      my.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, [mx, my]);
  const h = size / 2;
  const t = [`translateZ(${h}px)`, `rotateY(90deg) translateZ(${h}px)`, `rotateY(180deg) translateZ(${h}px)`, `rotateY(-90deg) translateZ(${h}px)`, `rotateX(90deg) translateZ(${h}px)`, `rotateX(-90deg) translateZ(${h}px)`];
  return (
    <div style={{ perspective: 1100 }} aria-hidden="true">
      <motion.div style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}>
        <div className="cube-tilt" style={{ transformStyle: "preserve-3d" }}>
          <div className="cube-spin relative" style={{ width: size, height: size, transformStyle: "preserve-3d" }}>
            {faces.slice(0, 6).map((f, i) => (
              <div
                key={f + i}
                className="absolute inset-0 flex items-center justify-center border border-white/60 text-center text-white uppercase"
                style={{ transform: t[i], background: `linear-gradient(135deg, ${from}, ${to})`, opacity: 0.92, fontSize: size / 6.5, letterSpacing: "0.02em", ...display }}
              >
                {f}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ---------- Small pieces ---------- */
const Arrow = ({ className = "", stroke = 14 }: { className?: string; stroke?: number }) => (
  <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden="true">
    <path d="M18 82 82 18M30 18h52v52" stroke="currentColor" strokeWidth={stroke} strokeLinecap="square" />
  </svg>
);

function PrincipleWord({ word, i, p }: { word: string; i: number; p: MotionValue<number> }) {
  const a = i / 3, b = (i + 1) / 3;
  const color = useTransform(p, [a - 0.1, a + 0.05, b - 0.05, b + 0.1], ["#4b5563", "#ffffff", "#ffffff", "#4b5563"]);
  return (
    <motion.h3 style={{ color, ...display }} className="text-[18vw] uppercase leading-[0.92] md:text-[9vw]">
      {word}
    </motion.h3>
  );
}

/* ---------- Page ---------- */
export default function AnimateView() {
  const cardRef = useRef<HTMLDivElement>(null);
  const principlesRef = useRef<HTMLElement>(null);
  const { scrollYProgress: pP } = useScroll({ target: principlesRef, offset: ["start start", "end end"] });

  return (
    <div className="bg-[#f3f4f6] text-black antialiased" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        html { scroll-behavior: smooth; }
        .cube-tilt { transform: rotateX(-22deg); }
        @keyframes spin3d { to { transform: rotateY(360deg); } }
        .cube-spin { animation: spin3d 24s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .cube-spin { animation: none; } html { scroll-behavior: auto; } }
      `}</style>

      {/* Hero: perspective tunnel */}
      <section id="home" className="p-3">
        <div className="relative h-[calc(100svh-1.5rem)] min-h-[640px] overflow-hidden rounded-3xl bg-black">
          <PerspectiveTunnelHero
            items={tunnelItems}
            eyebrow="Hi, I'm"
            title={<>Hemleen<br />Francis</>}
            subtitle={<><span className="font-bold text-teal-300">{profile.role}.</span> {profile.tagline}</>}
          />
          <header className="absolute inset-x-0 top-0 z-30 m-4">
            <nav className="mx-auto flex max-w-5xl items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm" aria-label="Primary">
              <a href="#home" className="flex items-center gap-3 text-sm font-semibold">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-black text-xs text-white">HF</span>
                <span className="hidden sm:inline">Hemleen <span className="text-teal-600">Francis</span></span>
              </a>
              <ul className="flex gap-6 text-sm">
                {nav.map((n) => (
                  <li key={n.id}>
                    <a href={`#${n.id}`} className="font-medium text-black/70 transition-colors hover:text-teal-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600">{n.label}</a>
                  </li>
                ))}
              </ul>
              <a href="#contact" className="rounded-lg border border-black px-4 py-1.5 text-sm font-semibold transition hover:bg-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600">Hire me</a>
            </nav>
          </header>
        </div>
      </section>

      {/* About */}
      <section id="about" className="p-3 pt-0">
        <div className="relative overflow-hidden rounded-3xl bg-black px-6 py-20 text-white md:px-12">
          <p className="absolute right-6 top-6 text-sm text-white/40 md:right-12">02/05</p>
          <div className="grid gap-12 md:grid-cols-2">
            <motion.h2 initial={{ x: -60, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }} style={display} className="text-[22vw] uppercase leading-[0.9] md:text-[13vw]">
              <span className="text-teal-400">/</span>About
            </motion.h2>
            <div className="md:self-end">
              <motion.div initial={{ rotate: -90, opacity: 0 }} whileInView={{ rotate: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.9 }}>
                <Arrow className="h-24 w-24 text-white/25 md:h-36 md:w-36" />
              </motion.div>
              <h3 className="mt-6 text-sm font-semibold text-teal-300">My Journey</h3>
              <div className="mt-3 max-w-md space-y-4 text-sm leading-relaxed text-white/80">
                {journey.map((p) => <p key={p}>{p}</p>)}
              </div>
              <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-white/50">Coding since 2018 · {profile.location}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Skills & Technologies (own component) */}
      <SkillsSection intro={skillIntro} groups={skillGroups} />

      {/* Principles: sticky card, words light up on scroll */}
      <section ref={principlesRef} className="relative h-[240vh] bg-white px-3">
        <div className="sticky top-0 flex h-screen items-center py-3">
          <div ref={cardRef} className="relative grid h-full max-h-[760px] w-full overflow-hidden rounded-3xl bg-black px-6 py-10 text-white md:grid-cols-2 md:px-12">
            <div className="flex flex-col justify-between">
              <div>{principles.map((w, i) => <PrincipleWord key={w} word={w} i={i} p={pP} />)}</div>
              <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/70">{belief}</p>
            </div>
            <div className="relative hidden items-center justify-center md:flex">
              <div className="absolute h-80 w-80 rounded-full bg-gradient-to-br from-teal-400/30 to-blue-600/30 blur-3xl" />
              <Cube faces={["Clean", "Tested", "Typed", "Fast", "Secure", "Useful"]} size={210} from={BLUE} to={TEAL} />
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-white px-6 pb-8 pt-16 md:px-12">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
          <div className="flex items-start gap-4">
            <Arrow className="mt-2 h-14 w-14 shrink-0 text-teal-500 md:h-24 md:w-24" />
            <h2 style={display} className="text-[14vw] uppercase leading-[0.95] md:text-[6.5vw]">Let's work<br />together</h2>
          </div>
          <motion.a
            href={`mailto:${profile.email}`}
            whileHover={{ backgroundColor: "#000", color: "#fff" }}
            className="rounded-xl border border-black px-6 py-3 text-sm font-semibold uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          >
            Send me a message
          </motion.a>
        </div>

        <dl className="mt-14 grid gap-px border-t border-dashed border-black/40 pt-8 text-sm md:grid-cols-4">
          {[
            ["Email", profile.email, `mailto:${profile.email}`],
            ["Phone", profile.phone, "tel:+919629817352"],
            ["Location", profile.location, undefined],
            ["Response Time", profile.response, undefined],
          ].map(([k, v, href]) => (
            <div key={k} className="py-3 md:pr-6">
              <dt className="text-black/50">{k}</dt>
              <dd className="mt-1 font-semibold leading-snug">
                {href ? <a href={href} className="break-all hover:text-teal-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600">{v}</a> : v}
              </dd>
            </div>
          ))}
        </dl>

        <p style={display} className="mt-12 select-none whitespace-nowrap text-center text-[15.5vw] uppercase leading-none text-transparent [-webkit-text-stroke:1px_#9ca3af] md:[-webkit-text-stroke:2px_#9ca3af]">
          {profile.name}
        </p>
        <footer className="mt-6 flex flex-col justify-between gap-2 text-xs text-black/60 sm:flex-row">
          <span>© {new Date().getFullYear()} {profile.name}. All rights reserved.</span>
          <span className="flex gap-5"><a href={`mailto:${profile.email}`} className="hover:text-teal-600">Email</a><a href="tel:+919629817352" className="hover:text-teal-600">Phone</a></span>
        </footer>
      </section>
    </div>
  );
}
