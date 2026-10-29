
"use client";

import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface SkillItem {
    name: string;
    code: string;
    navigate: string;
    icon: ReactNode;
}

interface SkillViewProps {
    items: SkillItem[];
    title?: ReactNode;
    subtitle?: string;
    autoPlay?: boolean;
    interval?: number;
    className?: string;
}

export default function SkillView({
    items,
    title = (
        <>
            Every skill,
            <br />
            brought into focus.
        </>
    ),
    subtitle = "Explore the technologies behind every project.",
    autoPlay = true,
    interval = 2500,
    className = "",
}: SkillViewProps) {
    const containerRef = useRef<HTMLElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [containerWidth, setContainerWidth] = useState(1200);
    const [isPaused, setIsPaused] = useState(false);

    const reduceMotion = useReducedMotion();

    const total = items.length;

    // Keep the selected index valid if the category changes.
    useEffect(() => {
        setActiveIndex((current) =>
            total > 0 ? current % total : 0
        );
    }, [total]);

    // Responsive gallery dimensions.
    useEffect(() => {
        const element = containerRef.current;
        if (!element) return;

        const observer = new ResizeObserver(([entry]) => {
            setContainerWidth(entry.contentRect.width);
        });

        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    // Automatically advance through the skills.
    useEffect(() => {
        if (
            !autoPlay ||
            reduceMotion ||
            isPaused ||
            total <= 1
        ) {
            return;
        }

        const timer = window.setInterval(() => {
            setActiveIndex((current) => (current + 1) % total);
        }, Math.max(1000, interval));

        return () => window.clearInterval(timer);
    }, [autoPlay, interval, isPaused, reduceMotion, total]);

    const goTo = useCallback(
        (index: number) => {
            if (total === 0) return;

            setActiveIndex(((index % total) + total) % total);
        },
        [total]
    );

    const goNext = useCallback(() => {
        goTo(activeIndex + 1);
    }, [activeIndex, goTo]);

    const goPrevious = useCallback(() => {
        goTo(activeIndex - 1);
    }, [activeIndex, goTo]);

    // Touch navigation for mobile.
    const touchStartX = useRef<number | null>(null);

    const cardWidth = Math.min(
        270,
        Math.max(160, containerWidth * 0.23)
    );

    const cardHeight = containerWidth < 640 ? 170 : 205;
    const gap = containerWidth < 640 ? 12 : 18;

    if (total === 0) {
        return null;
    }

    return (
        <section
            ref={containerRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocusCapture={() => setIsPaused(true)}
            onBlurCapture={(event) => {
                if (
                    !event.currentTarget.contains(
                        event.relatedTarget as Node | null
                    )
                ) {
                    setIsPaused(false);
                }
            }}
            onTouchStart={(event) => {
                touchStartX.current = event.touches[0].clientX;
                setIsPaused(true);
            }}
            onTouchEnd={(event) => {
                const start = touchStartX.current;

                if (start !== null) {
                    const delta =
                        start - event.changedTouches[0].clientX;

                    if (Math.abs(delta) > 40) {
                        goTo(
                            activeIndex + (delta > 0 ? 1 : -1)
                        );
                    }
                }

                touchStartX.current = null;
                setIsPaused(false);
            }}
            className={`relative flex min-h-[650px] w-full
                flex-col items-center justify-center overflow-hidden
                bg-white py-16 text-black sm:min-h-[700px]
                ${className}`}
        >
            {/* Heading */}
            <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 mb-10 px-5 text-center
                    sm:mb-14"
            >
                <h2 className="text-3xl font-semibold leading-[1.05]
                    tracking-[-0.06em] sm:text-4xl md:text-5xl">
                    {title}
                </h2>
            </motion.div>

            {/* Curved skill cards */}
            <div
                className="relative w-full"
                style={{
                    height: cardHeight + 100,
                    perspective: "1200px",
                    perspectiveOrigin: "50% 50%",
                    touchAction: "pan-y",
                }}
            >
                <div
                    className="absolute left-1/2 top-1/2"
                    style={{
                        width: cardWidth,
                        height: cardHeight,
                        transform: "translate(-50%, -50%)",
                        transformStyle: "preserve-3d",
                    }}
                >
                    {items.map((item, index) => {
                        // Shortest distance allows circular navigation.
                        let offset = index - activeIndex;

                        if (offset > total / 2) {
                            offset -= total;
                        } else if (offset < -total / 2) {
                            offset += total;
                        }

                        const distance = Math.abs(offset);
                        const visible = distance <= 3;

                        const x = offset * (cardWidth + gap);
                        const rotateY = Math.max(
                            -60,
                            Math.min(60, offset * 22)
                        );
                        const rotateZ = Math.max(
                            -5,
                            Math.min(5, offset * 1.2)
                        );
                        const curveY = Math.min(
                            65,
                            distance * distance * 9
                        );
                        const scale = Math.max(
                            0.78,
                            1 - distance * 0.07
                        );

                        return (
                            <motion.article
                                key={`${item.navigate}-${index}`}
                                initial={false}
                                animate={{
                                    x,
                                    y: curveY,
                                    rotateY,
                                    rotateZ,
                                    scale,
                                    opacity: visible
                                        ? Math.max(
                                            0.3,
                                            1 - distance * 0.2
                                        )
                                        : 0,
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: reduceMotion ? 300 : 85,
                                    damping: 22,
                                    mass: 0.8,
                                }}
                                onClick={() => goTo(index)}
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    transformStyle: "preserve-3d",
                                    transformOrigin: "center center",
                                    zIndex: 100 - distance,
                                    pointerEvents: visible
                                        ? "auto"
                                        : "none",
                                    cursor: "pointer",
                                }}
                                aria-label={`Select ${item.name}`}
                                aria-current={
                                    index === activeIndex
                                        ? "true"
                                        : undefined
                                }
                                className={`overflow-hidden rounded-xl
                                    border bg-white shadow-sm
                                    transition-colors ${index === activeIndex
                                        ? "border-black"
                                        : "border-neutral-200"
                                    }`}
                            >
                                {/* Skill icon */}
                                <div className="flex h-full flex-col
                                    items-center justify-center gap-4
                                    px-3 text-center sm:gap-5">
                                    <div
                                        className="flex items-center
                                            justify-center text-5xl
                                            sm:text-6xl"
                                        aria-hidden="true"
                                    >
                                        {item.icon}
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-semibold
                                            uppercase tracking-wide
                                            sm:text-base">
                                            {item.name}
                                        </h3>

                                        <p className="mt-1 text-xs
                                            text-neutral-500">
                                            {item.navigate}
                                        </p>
                                    </div>
                                </div>
                            </motion.article>
                        );
                    })}
                </div>
            </div>

            {/* Caption */}
            <div className="mt-5 max-w-md px-6 text-center">
                <p className="text-sm leading-relaxed text-neutral-500">
                    {subtitle}
                </p>

                <p className="mt-2 text-xs text-neutral-400">
                    {items[activeIndex]?.name} · {activeIndex + 1} of{" "}
                    {total}
                </p>
            </div>

            {/* Navigation */}
            <div className="mt-6 flex items-center justify-center gap-4">
                <button
                    type="button"
                    onClick={goPrevious}
                    aria-label="Previous skill"
                    className="flex h-9 w-9 items-center justify-center
                        rounded-full border border-neutral-200
                        hover:bg-neutral-100"
                >
                    ←
                </button>

                <div className="flex items-center gap-1.5">
                    {items.map((item, index) => (
                        <button
                            key={`${item.navigate}-dot`}
                            type="button"
                            aria-label={`Show ${item.name}`}
                            aria-current={
                                index === activeIndex ? "true" : undefined
                            }
                            onClick={() => goTo(index)}
                            className={`h-1.5 rounded-full
                                transition-all duration-300 ${index === activeIndex
                                    ? "w-6 bg-black"
                                    : "w-1.5 bg-neutral-300"
                                }`}
                        />
                    ))}
                </div>

                <button
                    type="button"
                    onClick={goNext}
                    aria-label="Next skill"
                    className="flex h-9 w-9 items-center justify-center
                        rounded-full border border-neutral-200
                        hover:bg-neutral-100"
                >
                    →
                </button>
            </div>
        </section>
    );
}
