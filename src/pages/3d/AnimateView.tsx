import { motion } from "framer-motion";
import PerspectiveTunnelHero, { type TunnelItem } from "./perspective-tunnel-hero";
import SkillsSection from "./SkillSection";
import HeroSection from "./Hero";
import AboutSection from "./About";
import Contact from "./Contact";

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

const heroItems: TunnelItem[] = [
  { title: "Frontend", label: " 5+ years" }, { title: "Backend", label: "5+ years" },
  { title: "Mobile App", label: "Mobile App" }, { title: "Docker", label: "DevOps" },
];
const aboutItems: TunnelItem[] = [
  { title: "2018", label: "Started coding" }, { title: "React", label: "Specialty" }, { title: "Node.js", label: "Specialty" },
  { title: "Web apps", label: "Building" }, { title: "Open source", label: "Contributing" }, { title: "Community", label: "Sharing" },
  { title: "Maintainable", label: "Belief" }, { title: "Scalable", label: "Belief" }, { title: "Value", label: "Belief" },
];
const principleItems: TunnelItem[] = [
  { title: "Maintainable", label: "Principle" }, { title: "Scalable", label: "Principle" }, { title: "Valuable", label: "Principle" },
  { title: "Typed", label: "TypeScript" }, { title: "Tested", label: "Jest" }, { title: "Fast", label: "Redis" },
  { title: "Shipped", label: "Docker" }, { title: "Clean", label: "Code" }, { title: "Reliable", label: "Users" },
];
const contactItems: TunnelItem[] = [
  { title: "Email", label: "hemleen7" }, { title: "Phone", label: "+91" }, { title: "Coimbatore", label: "Location" },
  { title: "24h reply", label: "Response" }, { title: "Hello", label: "Say hi" }, { title: "Hire me", label: "Available" },
  { title: "Let's talk", label: "Contact" },
];

const nav = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];
const display = { fontFamily: "Anton, 'Bebas Neue', Impact, sans-serif" };

const Arrow = ({ className = "", stroke = 14 }: { className?: string; stroke?: number }) => (
  <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden="true">
    <path d="M18 82 82 18M30 18h52v52" stroke="currentColor" strokeWidth={stroke} strokeLinecap="square" />
  </svg>
);

/* ---------- Page ---------- */
export default function AnimateView() {
  return (
    <div className="bg-[#f3f4f6] text-black antialiased" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        html { scroll-behavior: smooth; }
        @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
      `}</style>

      {/* 1 · Home: tunnel driven by the wheel, hands scrolling back at both ends */}
      <section id="home" className="p-3">
        <div className="h-[calc(100svh-1.5rem)] min-h-[640px]">
          <PerspectiveTunnelHero
            className="rounded-3xl"
            items={heroItems}
            eyebrow="Hi, I'm"
            title={<>Hemleen<br />Francis</>}
            titleClassName="text-[20vw] md:text-[10vw]"
            subtitle={<><span className="font-bold text-teal-300">{profile.role}.</span> {profile.tagline}</>}
          >
            <header className="m-4">
              <nav className="pointer-events-auto mx-auto flex max-w-5xl items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm" aria-label="Primary">
                <a href="#home" className="flex items-center gap-3 text-sm font-semibold text-black">
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
                <a href="#contact" className="rounded-lg border border-black px-4 py-1.5 text-sm font-semibold text-black transition hover:bg-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600">Hire me</a>
              </nav>
            </header>
          </PerspectiveTunnelHero>
        </div>
      </section>

      {/* 2 · About */}
      <section id="about">
        <AboutSection />
        {/* <PerspectiveTunnelHero
          mode="scroll"
          items={aboutItems}
          eyebrow="02/05"
          title={<><span className="text-teal-400">/</span>About</>}
          titleClassName="text-[24vw] md:text-[14vw]"
          subtitle="My Journey"
        />
        <div className="p-3 pt-0">
          <div className="grid gap-10 rounded-3xl bg-black px-6 py-16 text-white md:grid-cols-2 md:px-12">
            <motion.div initial={{ rotate: -90, opacity: 0 }} whileInView={{ rotate: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.9 }}>
              <Arrow className="h-28 w-28 text-white/25 md:h-44 md:w-44" />
            </motion.div>
            <div>
              <h3 className="text-sm font-semibold text-teal-300">My Journey</h3>
              <div className="mt-3 max-w-md space-y-4 text-sm leading-relaxed text-white/80">
                {journey.map((p) => <p key={p}>{p}</p>)}
              </div>
              <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-white/50">Coding since 2018 · {profile.location}</p>
            </div>
          </div>
        </div> */}
      </section>

      {/* 3 · Skills (separate component, same tunnel) */}
      <SkillsSection />

      {/* 4 · Principles */}
      <section id="principles">
        <PerspectiveTunnelHero
          mode="scroll"
          items={principleItems}
          title={<>Maintainable<br />Scalable<br />Valuable</>}
          titleClassName="text-[15vw] md:text-[8vw]"
          subtitle={belief}
        />
      </section>

      {/* 5 · Contact */}
      <section id="contact">
        <PerspectiveTunnelHero
          mode="scroll"
          variant="light"
          items={contactItems}
          title={<>Let's work<br />together</>}
          titleClassName="text-[16vw] md:text-[9vw]"
          subtitle={profile.response}
        />
        <Contact />
        {/* <div className="bg-white px-6 pb-8 pt-14 md:px-12">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <Arrow className="h-14 w-14 shrink-0 text-teal-500 md:h-20 md:w-20" />
              <p className="text-xl font-medium md:text-2xl">Have a project in mind?</p>
            </div>
            <motion.a
              href={`mailto:${profile.email}`}
              whileHover={{ backgroundColor: "#000", color: "#fff" }}
              className="rounded-xl border border-black px-6 py-3 text-sm font-semibold uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
            >
              Send me a message
            </motion.a>
          </div>

          <dl className="mt-12 grid gap-px border-t border-dashed border-black/40 pt-8 text-sm md:grid-cols-4">
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
        </div> */}
      </section>
    </div>
  );
}
