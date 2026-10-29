"use client";

import { motion, useTransform, useReducedMotion, useMotionValue, useSpring, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

export interface TunnelItem {
  title: string;
  label?: string;
  /** Optional photo. Without it the card renders as a designed tile. */
  src?: string;
}

interface PerspectiveTunnelHeroProps {
  items: TunnelItem[];
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  className?: string;
  /** Overlay content (nav, footer) rendered above the tunnel */
  children?: ReactNode;
}

interface Stage { width: number; height: number; isMobile: boolean }
interface CardData { item: TunnelItem; cos: number; sin: number; rx: number; ry: number; rot: number; index: number }

const SPRING = { stiffness: 60, damping: 25, mass: 0.5 };
const display = { fontFamily: "Anton, 'Bebas Neue', Impact, sans-serif" };

function buildCards(items: TunnelItem[]): CardData[] {
  return items.map((item, i) => {
    const a = i * 137.5 * (Math.PI / 180);
    return {
      item, index: i,
      cos: Math.cos(a), sin: Math.sin(a),
      rx: 0.28 + (i % 3) * 0.08,
      ry: 0.26 + (i % 2) * 0.09,
      rot: (i % 2 === 0 ? 1 : -1) * (3 + (i % 5) * 2),
    };
  });
}

function useCameraParallax(enabled: boolean) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING);
  const y = useSpring(rawY, SPRING);
  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      rawX.set((e.clientX / window.innerWidth - 0.5) * 2);
      rawY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled, rawX, rawY]);
  return { x, y };
}

const tiles = [
  "bg-gradient-to-br from-teal-400 to-blue-600 text-white",
  "bg-black text-white ring-1 ring-white/25",
  "bg-white text-black",
];

function TunnelCard({ card, progress, pointer, total, stage }: {
  card: CardData; progress: MotionValue<number>;
  pointer: { x: MotionValue<number>; y: MotionValue<number> }; total: number; stage: Stage;
}) {
  const span = 0.55;
  const start = (card.index / total) * (1 - span);
  const local = useTransform(progress, [start, start + span], [0, 1]);
  const z = useTransform(local, [0, 1], [stage.isMobile ? -1200 : -1700, stage.isMobile ? 350 : 500]);
  const opacity = useTransform(local, [0, 0.18, 0.82, 0.98], [0, 1, 1, 0]);

  const w = stage.isMobile ? Math.max(130, Math.min(180, stage.width * 0.38)) : Math.max(180, Math.min(260, stage.width * 0.17));
  const baseX = card.cos * stage.width * card.rx;
  const baseY = card.sin * stage.height * card.ry;
  const pan = stage.isMobile ? 20 : 45;

  const transform = useTransform([z, pointer.x, pointer.y], ([cz, px, py]: number[]) =>
    `translate3d(calc(-50% + ${baseX - px * pan}px), calc(-50% + ${baseY - py * pan}px), ${cz}px) rotateZ(${card.rot}deg)`
  );

  const { item } = card;
  return (
    <motion.div style={{ width: w, transform, opacity, zIndex: card.index + 1 }} className="absolute left-1/2 top-1/2 aspect-[4/5] select-none will-change-transform">
      <div className={`group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl p-4 shadow-2xl shadow-black/60 transition-shadow duration-500 hover:shadow-teal-400/30 ${item.src ? "bg-neutral-900" : tiles[card.index % 3]}`}>
        {item.src && (
          <>
            <img src={item.src} alt="" draggable={false} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          </>
        )}
        <span className="relative text-[10px] font-semibold uppercase tracking-[0.25em] opacity-70">{item.label}</span>
        <span className="relative text-3xl uppercase leading-[0.95] sm:text-4xl" style={display}>{item.title}</span>
      </div>
    </motion.div>
  );
}

export default function PerspectiveTunnelHero({ items, eyebrow, title, subtitle, className = "", children }: PerspectiveTunnelHeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const cards = useRef(buildCards(items)).current;
  const [stage, setStage] = useState<Stage>({ width: 1440, height: 900, isMobile: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setStage({ width: r.width, height: r.height, isMobile: r.width < 768 });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const raw = useMotionValue(reduce ? 0.5 : 0);
  const progress = useSpring(raw, { stiffness: 80, damping: 30, restDelta: 0.0001 });

  /* The tunnel takes the wheel/touch only while the hero fills the screen,
     and hands scrolling back to the page at either end so the site stays reachable. */
  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const heroInView = () => {
      const r = el.getBoundingClientRect();
      return r.top > -window.innerHeight * 0.2 && r.bottom > window.innerHeight * 0.8;
    };
    const apply = (dy: number, e: Event) => {
      const cur = raw.get();
      if (!heroInView() || (dy > 0 && cur >= 1) || (dy < 0 && cur <= 0)) return;
      e.preventDefault();
      raw.set(Math.min(1, Math.max(0, cur + dy)));
    };
    const onWheel = (e: WheelEvent) => apply(e.deltaY * 0.0008, e);
    let lastY = 0;
    const onStart = (e: TouchEvent) => { lastY = e.touches[0].clientY; };
    const onMove = (e: TouchEvent) => {
      const y = e.touches[0].clientY;
      apply((lastY - y) * 0.003, e);
      lastY = y;
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
    };
  }, [raw, reduce]);

  const pointer = useCameraParallax(!reduce);
  const titleScale = useTransform(progress, [0, 0.5, 1], [0.8, 1, 1.3]);
  const titleOpacity = useTransform(progress, [0, 0.12, 0.85, 1], [0.35, 1, 1, 0]);
  const promptOpacity = useTransform(progress, [0, 0.12], [1, 0]);

  return (
    <div
      ref={ref}
      className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-black text-white ${className}`}
      style={{ perspective: stage.isMobile ? "900px" : "1200px" }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(rgba(45,212,191,0.28)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_55%,transparent_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.2)_0%,transparent_55%),radial-gradient(circle_at_85%_90%,rgba(37,99,235,0.25)_0%,transparent_45%)]" />
      <div className="pointer-events-none absolute h-[48vmin] w-[48vmin] rounded-full border border-teal-400/20" />
      <div className="pointer-events-none absolute h-[76vmin] w-[76vmin] rounded-full border border-dashed border-white/10" />

      <motion.div style={{ scale: titleScale, opacity: titleOpacity }} className="pointer-events-none z-0 flex max-w-3xl flex-col items-center px-6 text-center">
        {eyebrow && <p className="mb-3 text-sm text-teal-300">{eyebrow}</p>}
        <h1 className="bg-gradient-to-b from-white via-white to-teal-200/70 bg-clip-text text-[20vw] uppercase leading-[0.9] text-transparent md:text-[10vw]" style={display}>{title}</h1>
        {subtitle && <div className="mt-5 max-w-md text-sm text-white/70 sm:text-base">{subtitle}</div>}
      </motion.div>

      <motion.div style={{ opacity: promptOpacity }} className="pointer-events-none absolute bottom-6 z-20 flex flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
        <span>Scroll to explore</span>
        <div className="h-6 w-px bg-gradient-to-b from-teal-400 to-transparent" />
      </motion.div>

      <div className="pointer-events-none absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
        {cards.map((c) => (
          <TunnelCard key={c.index} card={c} progress={progress} pointer={pointer} total={cards.length} stage={stage} />
        ))}
      </div>

      {children && <div className="pointer-events-none absolute inset-x-0 top-0 z-30">{children}</div>}
    </div>
  );
}
