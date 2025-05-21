"use client";

import { useEffect, useState, useLayoutEffect, useRef } from "react";
import {
    Table,
    Button,
    Space,
    Popconfirm,
    Tag,
    message,
    Modal,
    Form,
    Input,
} from "antd";
import Link from "next/link";
import {
    EyeOutlined,
    EyeInvisibleOutlined,
    DeleteOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import { Project } from "@/model/Project";
import { gsap } from "gsap";

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const cardRef = useRef<HTMLDivElement | null>(null);

    const fetchProjects = async () => {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/projects`
        );
        try {
            const data = await res.json();
            console.log("Réponse API projets admin :", data);
            const parsed = data["hydra:member"] || data.member || data;
            setProjects(Array.isArray(parsed) ? parsed : []);
        } catch (error) {
            console.error("Erreur de parsing JSON :", error);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    useLayoutEffect(() => {
        const prefersReduced = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        if (prefersReduced) return;

        const ctx = gsap.context(() => {
            gsap.from(cardRef.current, {
                opacity: 0,
                y: 60,
                duration: 0.8,
                ease: "power2.out",
            });
            gsap.set(".new-btn", { scale: 1 });
            const tl = gsap
                .timeline({ paused: true })
                .to(".new-btn", {
                    scale: 1.05,
                    duration: 0.15,
                    ease: "power1.inOut",
                })
                .to(".new-btn", {
                    scale: 1,
                    duration: 0.15,
                    ease: "power1.inOut",
                });
            document
                .querySelectorAll<HTMLButtonElement>(".new-btn")
                .forEach((btn) => {
                    btn.addEventListener("mouseenter", () => tl.play());
                    btn.addEventListener("mouseleave", () => tl.reverse());
                });
        }, cardRef);
        return () => ctx.revert();
    }, []);

    const togglePublish = async (id: number, isActive: boolean) => {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${id}`,
            {
                method: "PATCH",
                headers: { "Content-Type": "application/merge-patch+json" },
                body: JSON.stringify({ isActive }),
            }
        );
        if (res.ok) {
            message.success(`Projet ${isActive ? "publié" : "caché"}`);
            fetchProjects();
        } else {
            message.error("Erreur lors de la mise à jour");
        }
    };

    const deleteProject = async (id: number) => {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${id}`,
            {
                method: "DELETE",
            }
        );
        if (res.ok) {
            message.success("Projet supprimé");
            fetchProjects();
        } else {
            message.error("Erreur lors de la suppression");
        }
    };

    const columns = [
        {
            title: "Titre",
            dataIndex: "title",
            render: (_: any, record: Project) => (
                <Link href={`/api/projects/${record.id}`}>{record.title}</Link>
            ),
        },
        {
            title: "Statut",
            dataIndex: "isActive",
            render: (_: any, record: Project) =>
                record.isActive ? (
                    <Tag color="green" icon={<EyeOutlined />}>
                        Visible
                    </Tag>
                ) : (
                    <Tag color="red" icon={<EyeInvisibleOutlined />}>
                        Caché
                    </Tag>
                ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: Project) => (
                <Space>
                    <Button
                        size="small"
                        onClick={() =>
                            togglePublish(record.id, !record.isActive)
                        }
                        icon={
                            record.isActive ? (
                                <EyeInvisibleOutlined />
                            ) : (
                                <EyeOutlined />
                            )
                        }
                    >
                        {record.isActive ? "Cacher" : "Publier"}
                    </Button>
                    <Popconfirm
                        title="Supprimer définitivement ?"
                        okText="Oui"
                        cancelText="Annuler"
                        onConfirm={() => deleteProject(record.id)}
                    >
                        <Button danger size="small" icon={<DeleteOutlined />}>
                            Supprimer
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <main className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-200/50 via-orange-100 to-indigo-300 px-4 py-10 overflow-hidden">
            <div className="pointer-events-none absolute -top-32 -left-28 h-80 w-80 rounded-full bg-indigo-300 opacity-30 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 translate-x-1/3 translate-y-1/3 rounded-full bg-purple-300 opacity-20 blur-3xl" />

            <section
                ref={cardRef}
                className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-white/70 p-6 shadow-2xl backdrop-blur-md md:p-8"
            >
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h1 className="text-2xl font-extrabold text-indigo-700 md:text-3xl">
                        Projets ⚙️
                    </h1>
                    <div className="flex flex-wrap gap-2">
                        <Link href="/admin/projects/new">
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                className="new-btn flex items-center gap-1"
                            >
                                Nouveau projet
                            </Button>
                        </Link>
                    </div>
                </div>

                <Table
                    rowKey="id"
                    dataSource={projects}
                    columns={columns}
                    pagination={{ pageSize: 8 }}
                    className="rounded-lg"
                />
            </section>

            
        </main>
    );
}
