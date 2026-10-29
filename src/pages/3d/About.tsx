"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";

export interface FolderFile {
    name: string;
    meta: string;
    href?: string;
}

export interface Folder {
    title: string;
    subtitle: string;
    variant?: "light" | "teal" | "dark";
    files: FolderFile[];
}

interface AboutSectionProps {
    intro?: string;
    folders?: Folder[];
    contactHref?: string;
}

const display = { fontFamily: "Anton, 'Bebas Neue', Impact, sans-serif" };

/* One silhouette per layer, drawn in a 390 x 310 box so the notch and radii stay true at any width. */
const BACK_PATH =
    "M0 64 Q0 40 24 40 H170 C195 40 200 0 230 0 H366 Q390 0 390 24 V286 Q390 310 366 310 H24 Q0 310 0 286 Z";
const FRONT_PATH =
    "M0 94 Q0 70 24 70 H150 C175 70 180 96 205 96 H366 Q390 96 390 120 V286 Q390 310 366 310 H24 Q0 310 0 286 Z";

const maskUrl = (d: string) =>
    `url("data:image/svg+xml,${encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 390 310' preserveAspectRatio='none'><path d='${d}'/></svg>`
    )}")`;

const FRONT_MASK = { maskImage: maskUrl(FRONT_PATH), WebkitMaskImage: maskUrl(FRONT_PATH), maskSize: "100% 100%", WebkitMaskSize: "100% 100%" } as const;

const skin = {
    light: { back: "fill-neutral-200", front: "bg-white/55", text: "text-black", sub: "text-black/60", stroke: "rgba(255,255,255,0.9)", plus: "bg-black text-white" },
    teal: { back: "fill-teal-300", front: "bg-teal-400/30", text: "text-black", sub: "text-black/65", stroke: "rgba(255,255,255,0.7)", plus: "bg-black text-white" },
    dark: { back: "fill-neutral-800", front: "bg-neutral-900/80", text: "text-white", sub: "text-white/65", stroke: "rgba(255,255,255,0.25)", plus: "bg-white text-black" },
} as const;

const fileSkin = ["bg-white text-black ring-1 ring-black/10", "bg-black text-white", "bg-teal-500 text-white"];

const defaultFolders: Folder[] = [
    {
        title: "Experience",
        subtitle: "3 roles",
        variant: "light",
        files: [
            { name: "Software Engineer", meta: "Psg Software technology · 2023 to Present" },
            { name: "Frontend Developer", meta: "Company B · 2022 to 2024" },
            { name: "Intern", meta: "Company C · 2021" },
        ],
    },
    {
        title: "Education",
        subtitle: "2 items",
        variant: "teal",
        files: [
            { name: "BSc. Information Technology", meta: "Your University · 2022" },
            // { name: "AWS Cloud Practitioner", meta: "Certification · 2023" },
        ],
    },
    {
        title: "Beyond code",
        subtitle: "3 items",
        variant: "dark",
        files: [
            { name: "Open source", meta: "github.com/your-handle", href: "https://github.com/your-handle" },
            { name: "Writing", meta: "Notes on web performance" },
            { name: "Photography", meta: "Weekend hobby" },
        ],
    },
];

function FolderCard({ folder, open, onToggle, index }: { folder: Folder; open: boolean; onToggle: () => void; index: number }) {
    const reduce = useReducedMotion();
    const ref = useRef<HTMLDivElement>(null);
    const s = skin[folder.variant ?? "light"];
    const n = folder.files.length;
    const mid = (n - 1) / 2;

    // Lean toward the pointer
    const px = useMotionValue(0);
    const py = useMotionValue(0);
    const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-12, 12]), { stiffness: 120, damping: 18 });
    const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [8, -8]), { stiffness: 120, damping: 18 });

    const onMove = (e: React.PointerEvent) => {
        if (reduce || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width - 0.5);
        py.set((e.clientY - r.top) / r.height - 0.5);
    };
    const onLeave = () => { px.set(0); py.set(0); };

    return (
        <motion.div
            initial={reduce ? false : { opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="relative pt-36"
        >
            <motion.div
                ref={ref}
                onPointerMove={onMove}
                onPointerLeave={onLeave}
                style={{ rotateX, rotateY, transformPerspective: 900 }}
                className="relative aspect-[390/310] w-full"
            >
                {/* floor shadow */}
                <div className="pointer-events-none absolute inset-x-6 -bottom-2 h-8 rounded-full bg-black/25 blur-xl" />

                {/* back panel */}
                <svg viewBox="0 0 390 310" aria-hidden="true" className="absolute inset-0 h-full w-full">
                    <path d={BACK_PATH} className={s.back} />
                </svg>

                {/* files */}
                {folder.files.map((f, i) => {
                    const Tag = f.href ? "a" : "div";
                    return (
                        <motion.div
                            key={f.name}
                            animate={
                                open
                                    ? { y: `${-(42 + i * 20)}%`, x: `${(i - mid) * 4}%`, rotate: (i - mid) * 5 }
                                    : { y: "8%", x: "0%", rotate: 0 }
                            }
                            transition={{ type: "spring", stiffness: 110, damping: 16, delay: open ? i * 0.04 : 0 }}
                            style={{ zIndex: n - i }}
                            className="absolute left-[8%] top-[22%] h-[60%] w-[84%]"
                        >
                            <Tag
                                {...(f.href ? { href: f.href, target: "_blank", rel: "noopener noreferrer", tabIndex: open ? 0 : -1 } : {})}
                                className={`flex h-full w-full flex-col justify-between gap-2 rounded-2xl p-4 shadow-lg ${fileSkin[i % 3]} ${open ? "" : "pointer-events-none"} ${f.href ? "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600" : ""}`}
                            >
                                <span className="text-base font-semibold leading-tight">{f.name}</span>
                                <span className="text-base font-semibold leading-tight">{f.meta}</span>
                            </Tag>
                        </motion.div>
                    );
                })}

                {/* front glass panel */}
                <div className="absolute inset-0 z-20">
                    <div className={`absolute inset-0 backdrop-blur-xl ${s.front}`} style={FRONT_MASK} />
                    <div
                        className="absolute inset-0 opacity-70"
                        style={{ ...FRONT_MASK, background: "radial-gradient(ellipse at 15% 20%, rgba(255,255,255,0.55), transparent 55%), radial-gradient(ellipse at 90% 100%, rgba(20,184,166,0.25), transparent 50%)" }}
                    />
                    <svg viewBox="0 0 390 310" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full">
                        <path d={FRONT_PATH} fill="none" stroke={s.stroke} strokeWidth="1.5" />
                    </svg>
                    <button
                        onClick={onToggle}
                        aria-expanded={open}
                        aria-label={`${folder.title}, ${folder.subtitle}`}
                        className="absolute inset-0 flex items-end justify-between p-6 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-teal-600"
                    >
                        <span>
                            <span style={display} className={`block text-3xl uppercase leading-none ${s.text}`}>{folder.title}</span>
                            <span className={`mt-2 block text-sm ${s.sub}`}>{folder.subtitle}</span>
                        </span>
                        <motion.span
                            animate={{ rotate: open ? 45 : 0 }}
                            className={`grid h-12 w-12 place-items-center rounded-2xl text-2xl leading-none shadow-lg ${s.plus}`}
                        >
                            +
                        </motion.span>
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function AboutSection({
    intro = "I build web products end to end, from the interface people touch to the services behind it. Open a folder to see where I've worked, what I've studied and what I do when I'm not shipping.",
    folders = defaultFolders,
    contactHref = "#contact",
}: AboutSectionProps) {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section
            id="about"
            className="bg-[#f4f6f8] px-6 py-24 [background-image:radial-gradient(rgba(15,23,42,0.18)_1px,transparent_1px)] [background-size:24px_24px] md:px-12"
        >
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
                    <div>
                        <h2 style={display} className="text-[18vw] uppercase leading-[0.9] text-black md:text-[9vw]">About me</h2>
                        <p className="mt-6 max-w-xl text-base leading-relaxed text-black/70 md:text-lg">{intro}</p>
                    </div>
                    <motion.a
                        href={contactHref}
                        whileHover={{ scale: 1.06, backgroundColor: "#14b8a6", color: "#fff", borderColor: "#14b8a6" }}
                        className="grid h-28 w-28 shrink-0 place-items-center rounded-full border border-black/40 text-center text-sm font-semibold uppercase leading-tight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                    >
                        Get in<br />touch
                    </motion.a>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-x-10 md:grid-cols-3">
                    {folders.map((f, i) => (
                        <FolderCard
                            key={f.title}
                            folder={f}
                            index={i}
                            open={openIndex === i}
                            onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
                        />
                    ))}
                </div>

                <p className="mt-10 text-center text-sm text-black/60">Hover to lean. Click a folder to open it.</p>
            </div>
        </section>
    );
}