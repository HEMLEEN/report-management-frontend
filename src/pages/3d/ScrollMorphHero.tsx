"use client";

import React, { useState, useEffect, useMemo, useRef, type CSSProperties, type ReactNode } from "react";
import { motion, useTransform, useSpring, useMotionValue, useReducedMotion } from "framer-motion";

// --- Types ---
export type AnimationPhase = "scatter" | "line" | "circle";

export interface MorphItem {
    title: string;
    label: string;
}

interface ScrollMorphHeroProps {
    items: MorphItem[];
    /** Heading shown once the arc has formed */
    title: ReactNode;
    /** Paragraph under the heading */
    subtitle?: string;
    /** Text shown while the cards sit in a circle */
    introTitle?: string;
    introHint?: string;
    titleStyle?: CSSProperties;
    cardStyle?: CSSProperties;
    className?: string;
}

interface FlipCardProps {
    item: MorphItem;
    target: { x: number; y: number; rotation: number; scale: number; opacity: number };
    titleStyle?: CSSProperties;
}

// --- Card ---
const CARD_WIDTH = 84;
const CARD_HEIGHT = 112;
const MAX_SCROLL = 3000; // virtual scroll range

function FlipCard({ item, target, titleStyle }: FlipCardProps) {
    return (
        <motion.div
            animate={{
                x: target.x,
                y: target.y,
                rotate: target.rotation,
                scale: target.scale,
                opacity: target.opacity,
            }}
            transition={{ type: "spring", stiffness: 40, damping: 15 }}
            style={{
                position: "absolute",
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                transformStyle: "preserve-3d",
                perspective: "1000px",
            }}
            className="group cursor-default"
        >
            <motion.div
                className="relative h-full w-full"
                style={{ transformStyle: "preserve-3d" }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                whileHover={{ rotateY: 180 }}
            >
                {/* Front: skill name */}
                <div
                    className="absolute inset-0 flex h-full w-full items-center justify-center overflow-hidden rounded-xl border border-black/80 bg-white p-2 text-center"
                    style={{ backfaceVisibility: "hidden" }}
                >
                    <span
                        style={titleStyle}
                        className="break-words text-[15px] uppercase leading-[1.05] text-black"
                    >
                        {item.title}
                    </span>
                </div>

                {/* Back: category */}
                <div
                    className="absolute inset-0 flex h-full w-full items-center justify-center overflow-hidden rounded-xl border border-teal-600 bg-teal-600 p-2 text-center"
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                    <span className="text-xs font-semibold text-white">{item.label}</span>
                </div>
            </motion.div>
        </motion.div>
    );
}

// --- Helpers ---
const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

// --- Main component ---
export default function ScrollMorphHero({
    items,
    title,
    subtitle,
    introTitle = "Scroll to explore",
    introHint,
    titleStyle,
    cardStyle,
    className = "",
}: ScrollMorphHeroProps) {
    const reduceMotion = useReducedMotion();
    const total = items.length;

    const [introPhase, setIntroPhase] = useState<AnimationPhase>(reduceMotion ? "circle" : "scatter");
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    // --- Container size ---
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setContainerSize({ width: entry.contentRect.width, height: entry.contentRect.height });
            }
        });
        observer.observe(el);
        setContainerSize({ width: el.offsetWidth, height: el.offsetHeight });
        return () => observer.disconnect();
    }, []);

    // --- Virtual scroll ---
    // The hero captures wheel/touch only while it still has room to move in that
    // direction. At either end the event passes through, so the page keeps scrolling.
    const virtualScroll = useMotionValue(0);
    const scrollRef = useRef(0);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const apply = (delta: number, event: Event) => {
            const current = scrollRef.current;
            const canMove = (delta > 0 && current < MAX_SCROLL) || (delta < 0 && current > 0);
            if (!canMove) return; // let the page scroll
            event.preventDefault();
            const next = Math.min(Math.max(current + delta, 0), MAX_SCROLL);
            scrollRef.current = next;
            virtualScroll.set(next);
        };

        const onWheel = (e: WheelEvent) => apply(e.deltaY, e);

        let touchY = 0;
        const onTouchStart = (e: TouchEvent) => {
            touchY = e.touches[0].clientY;
        };
        const onTouchMove = (e: TouchEvent) => {
            const y = e.touches[0].clientY;
            const delta = touchY - y;
            touchY = y;
            apply(delta, e);
        };

        el.addEventListener("wheel", onWheel, { passive: false });
        el.addEventListener("touchstart", onTouchStart, { passive: true });
        el.addEventListener("touchmove", onTouchMove, { passive: false });
        return () => {
            el.removeEventListener("wheel", onWheel);
            el.removeEventListener("touchstart", onTouchStart);
            el.removeEventListener("touchmove", onTouchMove);
        };
    }, [virtualScroll]);

    // Circle -> arc between scroll 0 and 600; arc then shuffles through the rest.
    const morphProgress = useTransform(virtualScroll, [0, 600], [0, 1]);
    const smoothMorph = useSpring(morphProgress, { stiffness: 40, damping: 20 });

    const scrollRotate = useTransform(virtualScroll, [600, MAX_SCROLL], [0, 360]);
    const smoothScrollRotate = useSpring(scrollRotate, { stiffness: 40, damping: 20 });

    // --- Mouse parallax ---
    const mouseX = useMotionValue(0);
    const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 });

    useEffect(() => {
        const el = containerRef.current;
        if (!el || reduceMotion) return;
        const onMove = (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            const normalized = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouseX.set(normalized * 100);
        };
        el.addEventListener("mousemove", onMove);
        return () => el.removeEventListener("mousemove", onMove);
    }, [mouseX, reduceMotion]);

    // --- Intro sequence: scatter -> line -> circle ---
    useEffect(() => {
        if (reduceMotion) return;
        const t1 = setTimeout(() => setIntroPhase("line"), 500);
        const t2 = setTimeout(() => setIntroPhase("circle"), 2500);
        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, [reduceMotion]);

    // --- Random scatter positions ---
    const scatterPositions = useMemo(
        () =>
            Array.from({ length: total }, () => ({
                x: (Math.random() - 0.5) * 1500,
                y: (Math.random() - 0.5) * 1000,
                rotation: (Math.random() - 0.5) * 180,
                scale: 0.6,
                opacity: 0,
            })),
        [total]
    );

    // --- Mirror motion values into state for the manual morph maths ---
    const [morphValue, setMorphValue] = useState(0);
    const [rotateValue, setRotateValue] = useState(0);
    const [parallaxValue, setParallaxValue] = useState(0);

    useEffect(() => {
        const u1 = smoothMorph.on("change", setMorphValue);
        const u2 = smoothScrollRotate.on("change", setRotateValue);
        const u3 = smoothMouseX.on("change", setParallaxValue);
        return () => {
            u1();
            u2();
            u3();
        };
    }, [smoothMorph, smoothScrollRotate, smoothMouseX]);

    // Heading fades in once the arc has formed
    const contentOpacity = useTransform(smoothMorph, [0.8, 1], [0, 1]);
    const contentY = useTransform(smoothMorph, [0.8, 1], [20, 0]);

    const showIntro = introPhase === "circle" && morphValue < 0.5;

    return (
        <div ref={containerRef} className={`relative h-full w-full overflow-hidden bg-[#FAFAFA] ${className}`}>
            <div className="flex h-full w-full flex-col items-center justify-center">
                {/* Intro text (fades out as the arc forms) */}
                <div className="pointer-events-none absolute top-1/2 z-0 flex -translate-y-1/2 flex-col items-center justify-center px-4 text-center">
                    <motion.p
                        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                        animate={
                            showIntro
                                ? { opacity: 1 - morphValue * 2, y: 0, filter: "blur(0px)" }
                                : { opacity: 0, filter: "blur(10px)" }
                        }
                        transition={{ duration: 1 }}
                        className="text-2xl font-medium tracking-tight text-gray-800 md:text-4xl"
                    >
                        {introTitle}
                    </motion.p>
                    {introHint && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={showIntro ? { opacity: 0.6 - morphValue } : { opacity: 0 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="mt-4 text-sm text-gray-600"
                        >
                            {introHint}
                        </motion.p>
                    )}
                </div>

                {/* Heading once the arc is formed */}
                <motion.div
                    style={{ opacity: contentOpacity, y: contentY }}
                    className="pointer-events-none absolute top-[8%] z-10 flex flex-col items-center justify-center px-4 text-center"
                >
                    <h2 style={titleStyle} className="mb-4 uppercase leading-[0.95] text-black">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="max-w-lg text-sm leading-relaxed text-gray-700 md:text-base">{subtitle}</p>
                    )}
                </motion.div>

                {/* Cards. Decorative: the full list is rendered as real text below the hero. */}
                <div aria-hidden="true" className="relative flex h-full w-full items-center justify-center">
                    {items.map((item, i) => {
                        let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

                        if (introPhase === "scatter") {
                            target = scatterPositions[i];
                        } else if (introPhase === "line") {
                            const spacing = CARD_WIDTH + 10;
                            const lineX = i * spacing - (total * spacing) / 2;
                            target = { x: lineX, y: 0, rotation: 0, scale: 1, opacity: 1 };
                        } else {
                            const isMobile = containerSize.width < 768;
                            const minDimension = Math.min(containerSize.width, containerSize.height);

                            // A. Circle
                            const circleRadius = Math.min(minDimension * 0.35, 350);
                            const circleAngle = (i / total) * 360;
                            const circleRad = (circleAngle * Math.PI) / 180;
                            const circlePos = {
                                x: Math.cos(circleRad) * circleRadius,
                                y: Math.sin(circleRad) * circleRadius,
                                rotation: circleAngle + 90,
                            };

                            // B. Bottom arc ("rainbow", highest point in the middle)
                            const baseRadius = Math.min(containerSize.width, containerSize.height * 1.5);
                            const arcRadius = baseRadius * (isMobile ? 1.4 : 1.1);
                            const arcApexY = containerSize.height * (isMobile ? 0.35 : 0.25);
                            const arcCenterY = arcApexY + arcRadius;

                            const spreadAngle = isMobile ? 100 : 130;
                            const startAngle = -90 - spreadAngle / 2;
                            const step = total > 1 ? spreadAngle / (total - 1) : 0;

                            // Shuffle through the arc as scrolling continues, stopping with the last card in view
                            const scrollProgress = Math.min(Math.max(rotateValue / 360, 0), 1);
                            const boundedRotation = -scrollProgress * spreadAngle * 0.8;

                            const arcAngle = startAngle + i * step + boundedRotation;
                            const arcRad = (arcAngle * Math.PI) / 180;
                            const arcPos = {
                                x: Math.cos(arcRad) * arcRadius + parallaxValue,
                                y: Math.sin(arcRad) * arcRadius + arcCenterY,
                                rotation: arcAngle + 90,
                                scale: isMobile ? 1.3 : 1.6,
                            };

                            // C. Morph between the two
                            target = {
                                x: lerp(circlePos.x, arcPos.x, morphValue),
                                y: lerp(circlePos.y, arcPos.y, morphValue),
                                rotation: lerp(circlePos.rotation, arcPos.rotation, morphValue),
                                scale: lerp(1, arcPos.scale, morphValue),
                                opacity: 1,
                            };
                        }

                        return <FlipCard key={item.title} item={item} target={target} titleStyle={cardStyle} />;
                    })}
                </div>
            </div>
        </div>
    );
}