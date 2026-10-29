"use client";

import { Github, Linkedin, Twitter, Mail } from "lucide-react";
import { MinimalistHero } from "./MinimalistHero";
import PrImage from '../../assets/IMG_20260830_143154.jpg'

// Replace the placeholder copy, links and image with your own.
// Use a transparent-background PNG cutout of yourself so it sits on the teal circle.
export default function HeroSection() {
    return (
        <section id="home">
            <MinimalistHero
                logoText="Your Name"
                navLinks={[
                    { label: "HOME", href: "#home" },
                    { label: "SKILLS", href: "#skills" },
                    { label: "WORK", href: "#work" },
                    { label: "CONTACT", href: "#contact" },
                ]}
                mainText="Full-stack developer building fast, accessible web apps with React, Node.js and TypeScript."
                readMoreLink="#about"
                readMoreLabel="About me"
                imageSrc={PrImage}
                fallbackSrc="https://cdn.21st.dev/assets/mirror/69/69f133c713200aa29789f9f07a83f105cc28793926179eb4a224b0454a743a00.svg"
                imageAlt="Portrait of Your Name"
                overlayText={{ part1: "Build", part2: "better." }}
                socialLinks={[
                    { icon: Github, href: "https://github.com/your-handle", label: "GitHub" },
                    { icon: Linkedin, href: "https://linkedin.com/in/your-handle", label: "LinkedIn" },
                    { icon: Twitter, href: "https://twitter.com/your-handle", label: "Twitter" },
                    { icon: Mail, href: "mailto:you@example.com", label: "Email" },
                ]}
                locationText="Madurai, Tamil Nadu"
            />
        </section>
    );
}