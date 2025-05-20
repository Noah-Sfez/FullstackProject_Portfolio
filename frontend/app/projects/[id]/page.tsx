"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Typography, Spin, Image, Button } from "antd";
import Link from "next/link";
import { Project } from "@/model/Project";

const { Title, Paragraph } = Typography;

export default function ProjectDetailPage() {
    const { id } = useParams();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        if (id) fetchProject();
    }, [id]);

    if (loading) return <Spin />;

    if (!project) return <Paragraph>Projet introuvable</Paragraph>;

    return (
        <div style={{ padding: "24px" }}>
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
                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                    {project.media.map((imgUrl, index) => (
                        <Image
                            key={index}
                            src={imgUrl}
                            alt={`image-${index}`}
                            width={200}
                        />
                    ))}
                </div>
            )}

            <div style={{ marginTop: "24px" }}>
                <Link href="/">
                    <Button>Retour à la liste</Button>
                </Link>
            </div>
        </div>
    );
}
