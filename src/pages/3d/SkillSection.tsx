
import SkillView from "./SkillView";
import {
    SiNextdotjs, SiTypescript, SiRedux, SiTailwindcss, SiBootstrap, SiFramer, SiVuedotjs, SiNodedotjs, SiExpress,
    SiDatadog, SiMysql, SiPostgresql, SiMongodb, SiRedis, SiGit, SiDocker, SiVercel, SiFigma,
    SiCodeblocks, SiServerless, SiGraphql,
    SiJest,
    SiWebpack,
    SiSass,
    SiMui,
    SiSemanticuireact,
    SiFirebase,
    SiStripe,
    SiSocketdotio

} from "react-icons/si";
import { FaUpload } from 'react-icons/fa6';

import { FaReact, FaVuejs, FaFileExcel } from "react-icons/fa";
import { useState } from "react";

const categories = [
    { label: "Frontend", key: "frontend" },
    { label: "Backend", key: "backend" },
    { label: "Caches", key: "caches" },
    { label: "Tools", key: "tools" },
    { label: "Others", key: "others" },
] as const;

const skills = {
    frontend: [
        { name: "React", code: "1", navigate: "react", icon: <FaReact /> },
        { name: "Next.js", code: "2", navigate: "nextjs", icon: <SiNextdotjs /> },
        { name: "TypeScript", code: "3", navigate: "typescript", icon: <SiTypescript /> },
        { name: "Redux", code: "4", navigate: "redux", icon: <SiRedux /> },
        { name: "Tailwind CSS", code: "5", navigate: "tailwind", icon: <SiTailwindcss /> },
        { name: "Bootstrap", code: "6", navigate: "bootstrap", icon: <SiBootstrap /> },
        { name: "Framer Motion", code: "7", navigate: "framer-motion", icon: <SiFramer /> },
        { name: "Vue.js", code: "8", navigate: "vue", icon: <SiVuedotjs /> },
        { name: "Vuex", code: "9", navigate: "vuex", icon: <FaVuejs /> }
    ],

    backend: [
        { name: "Node.js", code: "1", navigate: "nodejs", icon: <SiNodedotjs /> },
        { name: "Express", code: "2", navigate: "express", icon: <SiExpress /> },
        { name: "TypeScript", code: "3", navigate: "typescript", icon: <SiTypescript /> },
        { name: "Oracle", code: "4", navigate: "oracle", icon: <SiDatadog /> },
        { name: "MySQL", code: "5", navigate: "mysql", icon: <SiMysql /> },
        { name: "PostgreSQL", code: "6", navigate: "postgresql", icon: <SiPostgresql /> },
        { name: "MongoDB", code: "7", navigate: "mongodb", icon: <SiMongodb /> },
        { name: "Redis", code: "8", navigate: "redis", icon: <SiRedis /> }
    ],

    caches: [
        { name: "Redis", code: "1", navigate: "redis", icon: <SiRedis /> },
        { name: "RedisInsight", code: "2", navigate: "redisinsight", icon: <SiRedis /> },
        { name: "Multer", code: "3", navigate: "multer", icon: <FaUpload /> }
    ],

    tools: [
        { name: "Git", code: "1", navigate: "git", icon: <SiGit /> },
        { name: "Docker", code: "2", navigate: "docker", icon: <SiDocker /> },
        { name: "AWS", code: "3", navigate: "aws", icon: <SiServerless /> },
        { name: "Vercel", code: "4", navigate: "vercel", icon: <SiVercel /> },
        { name: "Figma", code: "5", navigate: "figma", icon: <SiFigma /> },
        { name: "VS Code", code: "6", navigate: "vscode", icon: <SiCodeblocks /> }
    ],
    others: [
        { name: "GraphQL", code: "1", navigate: "graphql", icon: <SiGraphql /> },
        { name: "Jest", code: "2", navigate: "jest", icon: <SiJest /> },
        { name: "Webpack", code: "3", navigate: "webpack", icon: <SiWebpack /> },
        { name: "Sass", code: "4", navigate: "sass", icon: <SiSass /> },
        { name: "Material-UI", code: "5", navigate: "material-ui", icon: <SiMui /> },
        { name: "Semantic-UI", code: "6", navigate: "semantic-ui", icon: <SiSemanticuireact /> },
        { name: "Firebase", code: "7", navigate: "firebase", icon: <SiFirebase /> },
        { name: "Stripe", code: "8", navigate: "stripe", icon: <SiStripe /> },
        { name: "Socket.io", code: "9", navigate: "socketio", icon: <SiSocketdotio /> },
        { name: "Excel", code: "10", navigate: "excel", icon: <FaFileExcel /> }
    ],
};

export default function SkillsSection() {
    const [category, setCategory] =
        useState<keyof typeof skills>("frontend");

    return (
        <section className="w-full">
            <div className="mb-8 flex flex-wrap justify-center gap-3">
                {categories.map((item) => (
                    <button
                        key={item.key}
                        type="button"
                        onClick={() => setCategory(item.key)}
                        className={`rounded-full border px-5 py-2
                            text-sm transition ${category === item.key
                                ? "border-black bg-black text-white"
                                : "border-neutral-200 bg-white text-black"
                            }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            <SkillView
                key={category}
                items={skills[category]}
                title={
                    <>
                        Every skill,
                        <br />
                        brought into focus.
                    </>
                }
                subtitle={`Explore my ${category} technologies.`}
                autoPlay
                interval={2500}
                className="min-h-[600px]"
            />
        </section>
    );
}
