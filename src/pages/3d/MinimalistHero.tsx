"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "./utils";

interface MinimalistHeroProps {
    logoText: string;
    navLinks: { label: string; href: string }[];
    mainText: string;
    readMoreLink: string;
    readMoreLabel?: string;
    imageSrc: string;
    imageAlt: string;
    /** Shown if imageSrc fails to load */
    fallbackSrc?: string;
    overlayText: { part1: string; part2: string };
    socialLinks: { icon: LucideIcon; href: string; label: string }[];
    locationText: string;
    className?: string;
}

const display = { fontFamily: "Anton, 'Bebas Neue', Impact, sans-serif" };

const NavLink = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) => (
    <a
        href={href}
        onClick={onClick}
        className="text-sm font-medium tracking-widest text-foreground/60 transition-colors hover:text-teal-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600"
    >
        {children}
    </a>
);

const SocialIcon = ({ href, icon: Icon, label }: { href: string; icon: LucideIcon; label: string }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="text-foreground/60 transition-colors hover:text-teal-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600"
    >
        <Icon className="h-5 w-5" />
    </a>
);

export const MinimalistHero = ({
    logoText,
    navLinks,
    mainText,
    readMoreLink,
    readMoreLabel = "Read more",
    imageSrc,
    imageAlt,
    fallbackSrc,
    overlayText,
    socialLinks,
    locationText,
    className,
}: MinimalistHeroProps) => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div
            className={cn(
                "relative flex min-h-[100svh] w-full flex-col items-center justify-between overflow-hidden bg-background p-8 font-sans md:p-12",
                className
            )}
        >
            {/* Header */}
            <header className="z-30 flex w-full max-w-7xl items-center justify-between">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    style={display}
                    className="text-2xl uppercase tracking-wider"
                >
                    {logoText}
                </motion.div>

                <nav aria-label="Primary" className="hidden items-center space-x-8 md:flex">
                    {navLinks.map((link) => (
                        <NavLink key={link.label} href={link.href}>
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <button
                    onClick={() => setMenuOpen((v) => !v)}
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={menuOpen}
                    className="flex flex-col space-y-1.5 md:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600"
                >
                    <span className={cn("block h-0.5 w-6 bg-foreground transition-transform", menuOpen && "translate-y-2 rotate-45")} />
                    <span className={cn("block h-0.5 w-6 bg-foreground transition-opacity", menuOpen && "opacity-0")} />
                    <span className={cn("block h-0.5 w-6 bg-foreground transition-transform", menuOpen && "-translate-y-2 -rotate-45")} />
                </button>
            </header>

            {/* Mobile menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.nav
                        aria-label="Mobile"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                        className="absolute inset-x-0 top-20 z-40 flex flex-col items-center gap-5 border-y border-dashed border-foreground/30 bg-background py-8 md:hidden"
                    >
                        {navLinks.map((link) => (
                            <NavLink key={link.label} href={link.href} onClick={() => setMenuOpen(false)}>
                                {link.label}
                            </NavLink>
                        ))}
                    </motion.nav>
                )}
            </AnimatePresence>

            {/* Main content */}
            <main className="relative grid w-full max-w-7xl flex-grow grid-cols-1 items-center md:grid-cols-3">
                {/* Left: intro */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1 }}
                    className="z-20 order-2 text-center md:order-1 md:text-left"
                >
                    <p className="mx-auto max-w-xs text-sm leading-relaxed text-foreground/80 md:mx-0">{mainText}</p>
                    <a
                        href={readMoreLink}
                        className="mt-4 inline-block text-sm font-medium text-foreground underline decoration-from-font underline-offset-4 hover:text-teal-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600"
                    >
                        {readMoreLabel}
                    </a>
                </motion.div>

                {/* Center: portrait on circle */}
                <div className="relative order-1 flex h-full items-center justify-center py-8 md:order-2 md:py-0">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                        className="absolute z-0 h-[300px] w-[300px] rounded-full bg-teal-400 md:h-[400px] md:w-[400px] lg:h-[500px] lg:w-[500px]"
                    />
                    <motion.img
                        src={imageSrc}
                        alt={imageAlt}
                        className="relative z-10 h-auto w-56 scale-150 object-cover md:w-64 lg:w-72"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                        onError={(e) => {
                            if (!fallbackSrc) return;
                            const target = e.currentTarget;
                            target.onerror = null;
                            target.src = fallbackSrc;
                        }}
                    />
                </div>

                {/* Right: headline */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                    className="z-20 order-3 flex items-center justify-center text-center md:justify-start"
                >
                    <h1
                        style={{ ...display, fontWeight: 400 }}
                        className="text-[22vw] uppercase leading-[0.9] text-foreground md:text-[9vw]"
                    >
                        {overlayText.part1}
                        <br />
                        {overlayText.part2}
                    </h1>
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="z-30 flex w-full max-w-7xl items-center justify-between">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                    className="flex items-center space-x-4"
                >
                    {socialLinks.map((link) => (
                        <SocialIcon key={link.label} href={link.href} icon={link.icon} label={link.label} />
                    ))}
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.3 }}
                    className="text-sm font-medium text-foreground/80"
                >
                    {locationText}
                </motion.div>
            </footer>
        </div>
    );
};

export default MinimalistHero;