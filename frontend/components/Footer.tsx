"use client";
import { useRef, useEffect } from "react";
import {
    GithubOutlined,
    LinkedinOutlined,
    MailOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { gsap } from "gsap";

export default function Footer() {
    const footerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (footerRef.current) {
            gsap.fromTo(
                footerRef.current,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    delay: 0.5,
                    ease: "power2.out",
                }
            );
        }
    }, []);

    return (
        <footer
            ref={footerRef}
            className="w-full px-4 pt-8 pb-4 bg-gradient-to-r from-indigo-100 via-orange-100 to-purple-100 border-t border-indigo-200/40 shadow-inner"
        >
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
                <div className="flex flex-col items-center md:items-start">
                    <span className="font-extrabold text-indigo-700 text-xl tracking-wider">
                        © {new Date().getFullYear()} Projet IIM
                    </span>
                    <span className="text-gray-500 text-sm">
                        Made with <span className="text-pink-400">❤</span> —
                        Développement web
                    </span>
                </div>
                <div className="flex gap-5 text-indigo-700 text-2xl">
                    <Link
                        href="https://github.com/Noah-Sfez/FullstackProject_Portfolio"
                        target="_blank"
                        aria-label="GitHub"
                    >
                        <GithubOutlined className="hover:text-indigo-900 transition-transform hover:-translate-y-1" />
                    </Link>
                    <Link
                        href="https://www.linkedin.com/school/iim---institut-de-l'internet-et-du-multim%C3%A9dia/"
                        target="_blank"
                        aria-label="LinkedIn"
                    >
                        <LinkedinOutlined className="hover:text-indigo-900 transition-transform hover:-translate-y-1" />
                    </Link>
                    <a href="mailto:contact@iim.fr" aria-label="Mail">
                        <MailOutlined className="hover:text-indigo-900 transition-transform hover:-translate-y-1" />
                    </a>
                </div>
            </div>
        </footer>
    );
}
