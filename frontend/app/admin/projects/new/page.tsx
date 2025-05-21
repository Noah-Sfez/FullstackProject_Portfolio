"use client";

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
    Upload,
    UploadFile,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { getToken } from "@/utils/jwt";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";

const { Title } = Typography;
const MAX_FILE_SIZE_MB = 2;

export default function AddProject() {
    const [loading, setLoading] = useState(false);
    const [imageIris, setImageIris] = useState<string[]>([]);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [availableStudents, setAvailableStudents] = useState<
        { id: string; name: string; surname: string }[]
    >([]);
    const cardRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();

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
        }, cardRef);
        return () => ctx.revert();
    }, []);

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

    const getFullUrl = (path: string) => {
        if (/^https?:\/\//.test(path)) return path;
        return `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")}${path}`;
    };

    const uploadProps = {
        name: "file",
        listType: "picture-card" as const,
        multiple: true,
        fileList,
        beforeUpload: (file: File) => {
            const isValidSize = file.size / 1024 / 1024 < MAX_FILE_SIZE_MB;
            if (!isValidSize) {
                message.error(
                    `Chaque fichier doit être inférieur à ${MAX_FILE_SIZE_MB} Mo`
                );
            }
            return isValidSize || Upload.LIST_IGNORE;
        },
        customRequest: async (options: any) => {
            const { file, onSuccess, onError } = options;
            const formData = new FormData();
            formData.append("file", file);
            try {
                const token = await getToken();
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/media`,
                    {
                        method: "POST",
                        headers: { Authorization: `Bearer ${token}` },
                        body: formData,
                    }
                );
                const data = await res.json();
                if (res.ok && data.media?.id) {
                    const iri = `/api/media/${data.media.id}`;
                    const url = getFullUrl(data.media.contentUrl);
                    setFileList((prev) => [
                        ...prev,
                        Object.assign(file, {
                            status: "done",
                            response: data,
                            url,
                        }),
                    ]);
                    setImageIris((prev) => [...prev, iri]);
                    onSuccess(data, file);
                    message.success("Image uploadée avec succès !");
                } else {
                    throw new Error(data.description || "Upload failed");
                }
            } catch (err: any) {
                console.error(err);
                onError(err);
                message.error("Échec de l'upload de l'image");
            }
        },
        onChange(info: any) {
            setFileList(info.fileList);
        },
        onRemove: (file: UploadFile) => {
            if (file.response?.media?.id) {
                const iri = `/api/media/${file.response.media.id}`;
                setImageIris((prev) => prev.filter((i) => i !== iri));
            }
        },
    };

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            const token = await getToken();
            const body = {
                title: values.title,
                description: values.description,
                date: values.date,
                techno: values.techno,
                student: values.students?.map(
                    (id: string) => `/api/students/${id}`
                ),
                isActive: values.isActive ?? true,
                link: values.link,
                media: imageIris,
            };
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
            if (res.ok) message.success("Projet ajouté avec succès !");
            else
                message.error(
                    data?.detail || data?.description || "Échec de la création"
                );
        } catch (err) {
            console.error(err);
            message.error("Erreur inattendue.");
        } finally {
            setLoading(false);
            router.push("/admin/projects");
        }
    };

    return (
        <main className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-200/50 via-orange-100 to-indigo-300 px-4 py-10 overflow-hidden">
            <section
                ref={cardRef}
                className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-white/70 p-6 shadow-2xl backdrop-blur-md md:p-8"
            >
                <Title level={2} className="mb-6 text-center text-indigo-700">
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
                        <Input placeholder="Titre du projet" />
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
                            className="w-full"
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
                        <Input placeholder="https://..." />
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
                        <Input placeholder="React, Node.js, ..." />
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
                            {availableStudents.map((s) => (
                                <Select.Option
                                    key={s.id}
                                    value={s.id}
                                    label={`${s.name} ${s.surname}`}
                                >
                                    {s.name} {s.surname}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label="Images (plusieurs aperçus)">
                        <Upload {...uploadProps}>
                            {fileList.length < 5 && (
                                <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Ajouter</div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        label="Projet actif"
                        name="isActive"
                        valuePropName="checked"
                        initialValue={true}
                    >
                        <Switch />
                    </Form.Item>

                    <Form.Item className="mb-0">
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            className="cta-btn w-full bg-indigo-600"
                        >
                            Ajouter
                        </Button>
                    </Form.Item>
                </Form>
            </section>
        </main>
    );
}
