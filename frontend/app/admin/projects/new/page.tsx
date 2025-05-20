"use client";
/* ------------------------------------------------------------------
   Page « Ajout d’un projet » revisitée 🎨✨
   ------------------------------------------------------------------
   • Layout plein écran avec gradient / blobs
   • Carte glass-morphism centrée
   • Ant Design conservé (Input, Upload, Switch…)
   • Fade-in de la carte + pulse sur le CTA (GSAP optionnel)
------------------------------------------------------------------- */

import { useState, useLayoutEffect, useRef } from "react";
import {
    Form,
    Input,
    Button,
    message,
    Typography,
    Upload,
    Switch,
    InputNumber,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { getToken } from "@/utils/jwt";
import { Project } from "@/model/Project";
import { gsap } from "gsap";

const { Title } = Typography;

export default function AddProject() {
    /* ---------------- State ---------------- */
    const [loading, setLoading] = useState(false);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [students, setStudents] = useState([
        { name: "", surname: "", projects: [""] },
    ]);
    const cardRef = useRef<HTMLDivElement | null>(null);

    /* --------------- Animations --------------- */
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
            gsap.set(".cta-btn", { scale: 1 });
            const tl = gsap
                .timeline({ paused: true })
                .to(".cta-btn", {
                    scale: 1.05,
                    duration: 0.15,
                    ease: "power1.inOut",
                })
                .to(".cta-btn", {
                    scale: 1,
                    duration: 0.15,
                    ease: "power1.inOut",
                });
            const btn = document.querySelector<HTMLButtonElement>(".cta-btn");
            btn?.addEventListener("mouseenter", () => tl.play());
            btn?.addEventListener("mouseleave", () => tl.reverse());
        }, cardRef);
        return () => ctx.revert();
    }, []);

    /* --------------- Handlers --------------- */
    const handleStudentChange = (
        index: number,
        field: string,
        value: string
    ) => {
        const updated = [...students];
        updated[index][field] = value;
        setStudents(updated);
    };

    const addStudent = () => {
        setStudents([...students, { name: "", surname: "", projects: [""] }]);
    };

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            const token = await getToken();

            // Nettoie les étudiants pour garantir la structure attendue
            const cleanedStudents = students.map((s) => ({
                name: s.name,
                surname: s.surname,
                projects:
                    Array.isArray(s.projects) && s.projects.length > 0
                        ? s.projects
                        : [""], // Toujours un tableau de string
            }));

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/projects`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/ld+json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        title: values.title,
                        description: values.description,
                        date: Number(values.date), // Force en number
                        techno: values.techno,
                        student: cleanedStudents,
                        media: imageUrls,
                        isActive: values.isActive,
                        link: values.link,
                    }),
                }
            );
            const data = await res.json();
            if (res.ok) message.success("Projet ajouté avec succès !");
            else
                message.error(
                    data.description || "Échec lors de la création du projet"
                );
        } catch (err) {
            console.error(err);
            message.error("Erreur inattendue.");
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (info: any) => {
        const uploadedFiles = info.fileList
            .filter((file: any) => file.status === "done" && file.response?.url)
            .map((file: any) => file.response.url);
        setImageUrls(uploadedFiles);
    };

    /* ---------------- JSX ---------------- */
    return (
        <main className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-200/50 via-blue-100 to-indigo-300 px-4 py-10 overflow-hidden">
            {/* blobs décoratifs */}
            <div className="pointer-events-none absolute -top-32 -left-28 h-80 w-80 rounded-full bg-indigo-300 opacity-30 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 translate-x-1/3 translate-y-1/3 rounded-full bg-purple-300 opacity-20 blur-3xl" />

            {/* carte */}
            <section
                ref={cardRef}
                className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-white/70 p-6 shadow-2xl backdrop-blur-md md:p-8"
            >
                <Title
                    level={2}
                    className="mb-6 !text-center !text-3xl !font-extrabold !text-indigo-700 md:!text-4xl"
                >
                    Ajout d’un projet 🖼️
                </Title>

                <Form
                    layout="vertical"
                    onFinish={handleSubmit}
                    className="grid gap-5"
                >
                    <Form.Item
                        label="Titre"
                        name="title"
                        rules={[
                            { required: true, message: "Le titre est requis" },
                        ]}
                    >
                        <Input
                            placeholder="Titre du projet"
                            className="focus:ring-indigo-400"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[
                            {
                                required: true,
                                message: "La description est requise",
                            },
                        ]}
                    >
                        <Input.TextArea
                            rows={4}
                            placeholder="Description du projet"
                            className="focus:ring-indigo-400"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Année d'étude"
                        name="date"
                        rules={[
                            { required: true, message: "La date est requise" },
                        ]}
                    >
                        <InputNumber
                            min={1900}
                            max={3000}
                            className="w-full focus:ring-indigo-400"
                            placeholder="2024"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Lien externe (site, dépôt, etc.)"
                        name="link"
                        rules={[
                            { required: true, message: "Le lien est requis" },
                        ]}
                    >
                        <Input
                            placeholder="https://..."
                            className="focus:ring-indigo-400"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Technologies utilisées"
                        name="techno"
                        rules={[
                            {
                                required: true,
                                message: "Les technologies sont requises",
                            },
                        ]}
                    >
                        <Input
                            placeholder="React, Node.js, ..."
                            className="focus:ring-indigo-400"
                        />
                    </Form.Item>

                    <div>
                        <label className="block font-medium mb-1">
                            Étudiants
                        </label>
                        {students.map((student, idx) => (
                            <div key={idx} className="mb-2 flex gap-2">
                                <Input
                                    placeholder="Nom"
                                    value={student.name}
                                    onChange={(e) =>
                                        handleStudentChange(
                                            idx,
                                            "name",
                                            e.target.value
                                        )
                                    }
                                    className="focus:ring-indigo-400"
                                />
                                <Input
                                    placeholder="Prénom"
                                    value={student.surname}
                                    onChange={(e) =>
                                        handleStudentChange(
                                            idx,
                                            "surname",
                                            e.target.value
                                        )
                                    }
                                    className="focus:ring-indigo-400"
                                />
                                {/* Optionnel: gestion des projets */}
                            </div>
                        ))}
                        <Button
                            type="dashed"
                            onClick={addStudent}
                            className="mt-1"
                        >
                            Ajouter un étudiant
                        </Button>
                    </div>

                    <Form.Item label="Images (plusieurs possibles)">
                        <Upload
                            name="file"
                            action={`${process.env.NEXT_PUBLIC_API_URL}/api/upload`}
                            onChange={handleImageUpload}
                            multiple
                            listType="picture"
                            className="w-full"
                        >
                            <Button icon={<UploadOutlined />}>
                                Uploader des images
                            </Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        label="Projet actif"
                        name="isActive"
                        valuePropName="checked"
                        initialValue={true}
                        className="m-0"
                    >
                        <Switch />
                    </Form.Item>

                    <Form.Item className="mb-0">
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            className="cta-btn mt-2 w-full transform rounded-lg bg-indigo-600 transition hover:-translate-y-0.5 hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400/50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Ajouter
                        </Button>
                    </Form.Item>
                </Form>
            </section>
        </main>
    );
}
