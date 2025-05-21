"use client";
/* ------------------------------------------------------------------
   Page « Ajout d’un projet » revisitée 🎨✨
------------------------------------------------------------------- */

import { useState, useLayoutEffect, useRef, useEffect } from "react";
import {
    Form,
    Input,
    Button,
    message,
    Typography,
    Switch,
    InputNumber,
    Select,
} from "antd";
import { getToken } from "@/utils/jwt";
import { gsap } from "gsap";

const { Title } = Typography;

export default function AddProject() {
    /* ---------------- State ---------------- */
    const [loading, setLoading] = useState(false);
    const [imageIris, setImageIris] = useState<string[]>([]); // IRIs envoyés à l'API
    const [imagePreviews, setImagePreviews] = useState<string[]>([]); // URLs pour affichage
    const [availableStudents, setAvailableStudents] = useState<
        { id: string; name: string; surname: string }[]
    >([]);
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

    /* --------------- Fetch Students --------------- */
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students`)
            .then((res) => res.json())
            .then((data) => {
                setAvailableStudents(
                    Array.isArray(data.member) ? data.member : []
                );
            })
            .catch(() => setAvailableStudents([]));
    }, []);

    /* --------------- File Upload Handler --------------- */
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append("file", file);

            try {
                const token = await getToken();
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/media`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        body: formData,
                    }
                );
                const data = await res.json();
                console.log("Réponse upload image :", data);

                // Correction ici ! On construit l'IRI manuellement :
                if (res.ok && data.media && data.media.id) {
                    setImageIris((prev) => [
                        ...prev,
                        `/api/media/${data.media.id}`,
                    ]);
                    // Si tu as une url d'affichage tu peux la mettre ici, sinon laisse vide
                    // setImagePreviews((prev) => [...prev, data.media.contentUrl]);
                    message.success("Image uploadée avec succès !");
                } else {
                    message.error(
                        data.description || "Erreur lors de l'upload de l'image"
                    );
                }
            } catch (err) {
                console.error(err);
                message.error("Erreur lors de l'upload de l'image");
            }
        }
    };

    /* --------------- Submit Handler --------------- */
    const handleSubmit = async (values: any) => {
        setLoading(true);

        try {
            const token = await getToken();

            // Construction du payload
            const body = {
                title: values.title,
                description: values.description,
                date: values.date,
                techno: values.techno,
                student: values.students?.map((id) => `/api/students/${id}`), // CLÉ SINGULIER !
                isActive: values.isActive ?? true,
                link: values.link,
                media: imageIris,
            };

            // DEBUG PAYLOAD
            console.log("Payload envoyé :", body);

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/projects`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/ld+json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(body),
                }
            );
            const data = await res.json();
            if (res.ok) {
                message.success("Projet ajouté avec succès !");
            } else {
                message.error(
                    data?.detail ||
                        data?.description ||
                        "Échec lors de la création du projet"
                );
            }
        } catch (err) {
            console.error(err);
            message.error("Erreur inattendue.");
        } finally {
            setLoading(false);
        }
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

                    <Form.Item
                        label="Étudiants"
                        name="students"
                        rules={[
                            {
                                required: true,
                                message: "Sélectionnez au moins un étudiant",
                            },
                        ]}
                    >
                        <Select
                            mode="multiple"
                            allowClear
                            placeholder="Sélectionnez les étudiants"
                            optionLabelProp="label"
                        >
                            {Array.isArray(availableStudents) &&
                                availableStudents.map((student) => (
                                    <Select.Option
                                        key={student.id}
                                        value={student.id}
                                        label={`${student.name} ${student.surname}`}
                                    >
                                        {student.name} {student.surname}
                                    </Select.Option>
                                ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label="Image (une seule possible ici)">
                        <input
                            type="file"
                            name="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        {imagePreviews[0] && (
                            <img
                                src={imagePreviews[0]}
                                alt="Aperçu"
                                style={{ maxWidth: "100%", marginTop: 10 }}
                            />
                        )}
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
