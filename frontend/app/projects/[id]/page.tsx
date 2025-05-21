"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Typography, Spin, Image, Button, Tag } from "antd";
import Link from "next/link";
import { Project } from "@/model/Project";
import { gsap } from "gsap";

const { Title, Paragraph, Text } = Typography;

function getFullUrl(pathOrUrl: string) {
    if (/^https?:\/\//.test(pathOrUrl)) {
        return pathOrUrl;
    }
    const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";
    return `${base}${pathOrUrl}`;
}

export default function ProjectDetailPage() {
    const { id } = useParams();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (cardRef.current) {
            gsap.fromTo(
                cardRef.current,
                { opacity: 0, y: 60, scale: 0.97 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1,
                    ease: "power3.out",
                }
            );
        }
    }, [project]);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${id}`
                );
                const data = await res.json();
                setProject(data);
            } catch (err) {
                console.error("Erreur lors du chargement du projet :", err);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProject();
    }, [id]);

    if (loading)
        return (
            <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-orange-100 to-purple-100">
                <Spin size="large" />
            </div>
        );

    if (!project)
        return (
            <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-orange-100 to-purple-100">
                <Paragraph>Projet introuvable</Paragraph>
            </div>
        );

    return (
        <main className="relative min-h-screen bg-gradient-to-br from-indigo-100 via-orange-100 to-purple-100 flex items-center justify-center py-10 px-4 overflow-x-hiddenrelative flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-100 via-orange-100 to-purple-100 px-4 py-8 overflow-hidden">
            {/* Blobs décoratifs */}
            <div className="pointer-events-none absolute -top-24 -left-20 h-96 w-96 bg-indigo-200 opacity-30 rounded-full blur-3xl animate-pulse" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-[32rem] w-[32rem] translate-x-1/4 translate-y-1/4 bg-purple-200 opacity-20 rounded-full blur-3xl animate-pulse" />

            {/* Carte project */}
            <section
                ref={cardRef}
                className="relative mx-auto w-full max-w-2xl bg-white/70 shadow-2xl rounded-3xl p-8 backdrop-blur-xl border border-white/30 flex flex-col gap-5 animate-fade-in"
                style={{ zIndex: 10 }}
            >
                {/* Titre + année */}
                <div className="flex items-center justify-between gap-2 mb-2">
                    <Title
                        level={2}
                        className="!mb-0 !font-extrabold !text-indigo-800"
                        style={{ letterSpacing: ".5px" }}
                    >
                        {project.title}
                    </Title>
                    <Tag
                        color="orange"
                        className="text-lg px-4 py-1 rounded-xl"
                    >
                        {project.date}
                    </Tag>
                </div>

                <Paragraph className="text-lg text-gray-700 !mb-3">
                    {project.description}
                </Paragraph>

                <div className="flex flex-wrap gap-2 items-center">
                    <Tag color={project.isActive ? "green" : "red"}>
                        {project.isActive ? "Actif" : "Inactif"}
                    </Tag>
                    {project.techno && (
                        <Tag color="purple">
                            <span className="font-semibold">
                                {project.techno}
                            </span>
                        </Tag>
                    )}
                </div>

                {/* Lien externe */}
                {project.link && (
                    <Paragraph>
                        <Text strong>Lien externe : </Text>
                        <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-600 underline hover:text-orange-800 transition-colors"
                        >
                            {project.link}
                        </a>
                    </Paragraph>
                )}

                {/* Images / Médias */}
                {project.media?.length > 0 && (
                    <div className="flex gap-4 flex-wrap justify-center my-4">
                        {project.media.map((m, idx) => (
                            <div
                                key={m.id ?? idx}
                                className="rounded-xl overflow-hidden shadow-lg border-2 border-indigo-100"
                            >
                                <Image
                                    src={getFullUrl(m.contentUrl)}
                                    alt={`${project.title}-img-${idx}`}
                                    width={260}
                                    height={180}
                                    preview={true}
                                    className="hover:scale-105 transition-transform duration-200"
                                    style={{
                                        objectFit: "cover",
                                        borderRadius: 16,
                                    }}
                                    onLoad={(e) => {
                                        // Animation d’apparition à chaque image
                                        gsap.fromTo(
                                            e.target,
                                            { opacity: 0, scale: 0.96 },
                                            {
                                                opacity: 1,
                                                scale: 1,
                                                duration: 0.6,
                                                ease: "power2.out",
                                            }
                                        );
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Liste des étudiants */}
                {project.student &&
                    Array.isArray(project.student) &&
                    project.student.length > 0 && (
                        <div className="mt-3">
                            <Text strong>Équipe :</Text>
                            <div className="flex flex-wrap gap-3 mt-1">
                                {project.student.map((s, idx) => (
                                    <Tag
                                        key={s.id ?? idx}
                                        color="geekblue"
                                        className="text-base rounded-lg px-3 py-1 shadow"
                                    >
                                        {(s.name || "") +
                                            " " +
                                            (s.surname || "")}
                                    </Tag>
                                ))}
                            </div>
                        </div>
                    )}

                {/* CTA retour */}
                <div className="flex justify-end mt-6">
                    <Link href="/">
                        <Button
                            size="large"
                            className="bg-indigo-600 text-white font-bold rounded-xl px-8 py-2 shadow-xl transition-transform hover:-translate-y-1 hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500"
                            style={{ fontSize: "1.1rem" }}
                            onMouseEnter={(e) => {
                                gsap.to(e.currentTarget, {
                                    scale: 1.04,
                                    duration: 0.18,
                                });
                            }}
                            onMouseLeave={(e) => {
                                gsap.to(e.currentTarget, {
                                    scale: 1,
                                    duration: 0.18,
                                });
                            }}
                        >
                            ← Retour à la liste
                        </Button>
                    </Link>
                </div>
            </section>
        </main>
    );
}
