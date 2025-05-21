"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Head from "next/head";
import { Typography, Spin, Image, Button, Tag } from "antd";
import Link from "next/link";
import { Project } from "@/model/Project";
import { gsap } from "gsap";

const { Title, Paragraph, Text } = Typography;

function getFullUrl(pathOrUrl: string) {
    if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
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
                { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" }
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

    const schemaOrg = project
        ? {
              "@context": "https://schema.org",
              "@type": "CreativeWork",
              name: project.title,
              description: project.description,
              url:
                  typeof window !== "undefined"
                      ? window.location.href
                      : undefined,
              inLanguage: "fr",
              dateCreated: project.date,
              keywords: project.techno,
              image:
                  project.media?.map((m: any) => getFullUrl(m.contentUrl)) ||
                  [],
              author: {
                  "@type": "Organization",
                  name: "IIM",
              },
          }
        : null;

    if (loading)
        return (
            <main
                aria-busy="true"
                className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-orange-100 to-purple-100"
            >
                <Spin size="large" aria-label="Chargement du projet..." />
            </main>
        );

    if (!project)
        return (
            <main className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-orange-100 to-purple-100">
                <Paragraph>Projet introuvable</Paragraph>
            </main>
        );

    return (
        <>
            <Head>
                <title>{`${project.title} | Projet IIM`}</title>
                <meta
                    name="description"
                    content={project.description || "Projet étudiant IIM"}
                />
                <meta
                    property="og:title"
                    content={`${project.title} | Projet IIM`}
                />
                <meta
                    property="og:description"
                    content={project.description || "Projet étudiant IIM"}
                />
                <meta property="og:type" content="website" />
                <meta
                    property="og:image"
                    content={
                        project.media?.[0]?.contentUrl
                            ? getFullUrl(project.media[0].contentUrl)
                            : ""
                    }
                />
                <meta
                    property="og:url"
                    content={
                        typeof window !== "undefined"
                            ? window.location.href
                            : ""
                    }
                />
                {schemaOrg && (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify(schemaOrg),
                        }}
                    />
                )}
            </Head>
            <main
                className="relative min-h-screen bg-gradient-to-br from-indigo-100 via-orange-100 to-purple-100 flex items-center justify-center py-10 px-4 overflow-hidden"
                aria-labelledby="main-title"
                tabIndex={-1}
                id="main-content"
            >
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-24 -left-20 h-96 w-96 bg-indigo-200 opacity-30 rounded-full blur-3xl animate-pulse"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-0 right-0 h-[32rem] w-[32rem] translate-x-1/4 translate-y-1/4 bg-purple-200 opacity-20 rounded-full blur-3xl animate-pulse"
                />

                <article
                    ref={cardRef}
                    className="relative mx-auto w-full max-w-2xl bg-white/70 shadow-2xl rounded-3xl p-8 backdrop-blur-xl border border-white/30 flex flex-col gap-5"
                    aria-labelledby="main-title"
                    itemScope
                    itemType="https://schema.org/CreativeWork"
                >
                    <header className="flex items-center justify-between gap-2 mb-2">
                        <Title
                            id="main-title"
                            level={1}
                            className="!mb-0 !font-extrabold !text-indigo-800"
                            style={{ letterSpacing: ".5px" }}
                            itemProp="name"
                        >
                            {project.title}
                        </Title>
                        <Tag
                            color="orange"
                            className="text-lg px-4 py-1 rounded-xl"
                        >
                            <span aria-label="année de création">
                                {project.date}
                            </span>
                        </Tag>
                    </header>

                    <Paragraph
                        className="text-lg text-gray-700 !mb-3"
                        itemProp="description"
                    >
                        {project.description}
                    </Paragraph>

                    <div className="flex flex-wrap gap-2 items-center">
                        <Tag
                            color={project.isActive ? "green" : "red"}
                            aria-label={
                                project.isActive
                                    ? "Projet actif"
                                    : "Projet inactif"
                            }
                        >
                            {project.isActive ? "Actif" : "Inactif"}
                        </Tag>
                        {project.techno && (
                            <Tag color="purple">
                                <span
                                    className="font-semibold"
                                    itemProp="keywords"
                                >
                                    {project.techno}
                                </span>
                            </Tag>
                        )}
                    </div>

                    {project.link && (
                        <Paragraph>
                            <Text strong>Lien externe :</Text>{" "}
                            <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-orange-600 underline hover:text-orange-800 transition-colors"
                                aria-label={`Lien externe vers ${project.link}`}
                            >
                                {project.link}
                            </a>
                        </Paragraph>
                    )}

                    {project.media?.length > 0 && (
                        <section
                            aria-labelledby="images-title"
                            className="flex flex-col gap-3"
                        >
                            <Text id="images-title" strong className="sr-only">
                                Images du projet
                            </Text>
                            <div className="flex gap-4 flex-wrap justify-center my-4">
                                {project.media.map((m, idx) => (
                                    <figure
                                        key={m.id ?? idx}
                                        className="rounded-xl overflow-hidden shadow-lg border-2 border-indigo-100"
                                        itemProp="image"
                                        aria-label={`Illustration ${idx + 1}`}
                                    >
                                        <Image
                                            src={getFullUrl(m.contentUrl)}
                                            alt={`${
                                                project.title
                                            } - illustration ${idx + 1}`}
                                            width={260}
                                            height={180}
                                            preview={true}
                                            className="hover:scale-105 transition-transform duration-200"
                                            style={{
                                                objectFit: "cover",
                                                borderRadius: 16,
                                            }}
                                            onLoad={(e) => {
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
                                        <figcaption className="sr-only">{`Illustration du projet ${project.title}`}</figcaption>
                                    </figure>
                                ))}
                            </div>
                        </section>
                    )}

                    {project.student &&
                        Array.isArray(project.student) &&
                        project.student.length > 0 && (
                            <section
                                className="mt-3"
                                aria-labelledby="team-title"
                            >
                                <Text id="team-title" strong>
                                    Équipe :
                                </Text>
                                <ul
                                    className="flex flex-wrap gap-3 mt-1"
                                    aria-label="Liste des étudiants"
                                >
                                    {project.student.map((s, idx) => (
                                        <li key={s.id ?? idx}>
                                            <Tag
                                                color="geekblue"
                                                className="text-base rounded-lg px-3 py-1 shadow"
                                                aria-label={`${s.name ?? ""} ${
                                                    s.surname ?? ""
                                                }`}
                                            >
                                                {(s.name || "") +
                                                    " " +
                                                    (s.surname || "")}
                                            </Tag>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                    <nav className="flex justify-end mt-6" aria-label="Retour">
                        <Link href="/" legacyBehavior>
                            <a
                                tabIndex={0}
                                className="bg-indigo-600 text-white font-bold rounded-xl px-8 py-2 shadow-xl transition-transform hover:-translate-y-1 hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 text-lg"
                                style={{ fontSize: "1.1rem" }}
                                aria-label="Retour à la liste des projets"
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
                            </a>
                        </Link>
                    </nav>
                </article>
            </main>
        </>
    );
}
