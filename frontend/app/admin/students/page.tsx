"use client";

import { useEffect, useState, useLayoutEffect, useRef } from "react";
import { Button, Form, Input, message, Modal, Table } from "antd";

import { Project } from "@/model/Project";
import { gsap } from "gsap";
import { Candidat } from "@/model/Candidat";
import { PlusOutlined } from "@ant-design/icons";

export default function AdminProjectsPage() {
    /* ---------------- State ---------------- */
    const [candidates, setCandidates] = useState<Project[]>([]);
    const [studentLoading, setStudentLoading] = useState(false);
    const [studentModalOpen, setStudentModalOpen] = useState(false);

    const cardRef = useRef<HTMLDivElement | null>(null);

    /* ---------------- Fetch projects ---------------- */
    const fetchProjects = async () => {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/students`
        );
        try {
            const data = await res.json();
            console.log("Réponse API projets admin :", data);
            const parsed = data["hydra:member"] || data.member || data;
            setCandidates(Array.isArray(parsed) ? parsed : []);
        } catch (error) {
            console.error("Erreur de parsing JSON :", error);
        }
    };

    const handleAddStudent = async (values: any) => {
        setStudentLoading(true);
        try {
            const apiUrl =
                process.env.NEXT_PUBLIC_API_URL || "https://127.0.0.1:8000";
            const payload = {
                ...values,
                projects: [],
            };
            const res = await fetch(`${apiUrl}/api/students`, {
                method: "POST",
                headers: { "Content-Type": "application/ld+json" },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                message.success("Étudiant ajouté avec succès !");
                setStudentModalOpen(false);
            } else {
                const errorData = await res.json();
                console.error(errorData);
                message.error("Erreur lors de l'ajout de l'étudiant");
            }
        } catch (err) {
            console.error(err);
            message.error("Erreur inattendue.");
        } finally {
            setStudentLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [studentModalOpen]);

    /* ---------------- Animations ---------------- */
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

    /* ---------------- Table columns ---------------- */
    const columns = [
        {
            title: "Nom",
            render: (record: Candidat) => record.surname,
        },
        {
            title: "Prénom",
            render: (record: Candidat) => record.name,
        },
    ];

    /* ---------------- JSX ---------------- */
    return (
        <main className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-200/50 via-orange-100 to-indigo-300 px-4 py-10 overflow-hidden">
            <div className="pointer-events-none absolute -top-32 -left-28 h-80 w-80 rounded-full bg-indigo-300 opacity-30 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 translate-x-1/3 translate-y-1/3 rounded-full bg-purple-300 opacity-20 blur-3xl" />

            <section
                ref={cardRef}
                className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-white/70 p-6 shadow-2xl backdrop-blur-md md:p-8"
            >
                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h1 className="text-2xl font-extrabold text-indigo-700 md:text-3xl">
                        Étudiants ⚙️
                    </h1>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            className="new-btn flex items-center gap-1"
                            onClick={() => setStudentModalOpen(true)}
                        >
                            Ajouter un étudiant
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <Table
                    rowKey="id"
                    dataSource={candidates}
                    columns={columns}
                    pagination={{ pageSize: 8 }}
                    className="rounded-lg"
                />
            </section>
            <Modal
                title="Ajouter un étudiant 👨‍🎓"
                open={studentModalOpen}
                onCancel={() => setStudentModalOpen(false)}
                footer={null}
                destroyOnHidden
            >
                <Form
                    layout="vertical"
                    onFinish={handleAddStudent}
                    className="mt-4"
                >
                    <Form.Item
                        name="name"
                        label="Prénom"
                        rules={[
                            { required: true, message: "Prénom obligatoire" },
                        ]}
                    >
                        <Input placeholder="Jean" />
                    </Form.Item>
                    <Form.Item
                        name="surname"
                        label="Nom"
                        rules={[{ required: true, message: "Nom obligatoire" }]}
                    >
                        <Input placeholder="Dupont" />
                    </Form.Item>
                    <Form.Item className="mb-0">
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={studentLoading}
                            block
                        >
                            Ajouter
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </main>
    );
}
