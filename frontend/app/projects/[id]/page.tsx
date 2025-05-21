"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Typography, Spin, Image, Button } from "antd";
import Link from "next/link";
import { Project } from "@/model/Project";

const { Title, Paragraph } = Typography;

// Utilitaire pour construire une URL absolue si nécessaire
function getFullUrl(pathOrUrl: string) {
    if (/^https?:\/\//.test(pathOrUrl)) {
        return pathOrUrl;
    }
    // On enlève un slash final de l'env var au besoin
    const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";
    return `${base}${pathOrUrl}`;
}

export default function ProjectDetailPage() {
    const { id } = useParams();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <Spin />;

    if (!project) return <Paragraph>Projet introuvable</Paragraph>;

    return (
        <div style={{ padding: 24 }}>
            <Title level={2}>{project.title}</Title>
            <Paragraph>
                <strong>Description :</strong> {project.description}
            </Paragraph>
            <Paragraph>
                <strong>Date :</strong>{" "}
                {new Date(project.date).toLocaleDateString()}
            </Paragraph>
            <Paragraph>
                <strong>Lien :</strong>{" "}
                <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {project.link}
                </a>
            </Paragraph>

            {project.media.length > 0 && (
                <div
                    style={{
                        display: "flex",
                        gap: 16,
                        flexWrap: "wrap",
                    }}
                >
                    {project.media.map((m, idx) => (
                        <Image
                            key={m.id ?? idx}
                            src={getFullUrl(m.contentUrl)}
                            alt={`${project.title}-img-${idx}`}
                            width={200}
                            style={{ objectFit: "cover" }}
                        />
                    ))}
                </div>
            )}

            <div style={{ marginTop: 24 }}>
                <Link href="/">
                    <Button>Retour à la liste</Button>
                </Link>
            </div>
        </div>
    );
}
