"use client";

import { useState } from "react";
import { Form, Input, Button, message, Typography } from "antd";
import { getToken } from "@/utils/jwt";

const { Title } = Typography;

export default function AddProject() {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            const token = await getToken();
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/projects`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/ld+json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        name: values.name,
                        description: values.description,
                    }),
                }
            );

            const data = await res.json();

            if (res.ok) {
                message.success("Projet ajouté avec succès !");
            } else {
                console.error(data);
                message.error(
                    data.description || "Échec lors de la création du projet"
                );
            }
        } catch (err) {
            console.error(err);
            message.error("Erreur inattendue.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Title level={2}>Ajout d’un projet</Title>

            <Form layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    label="Nom"
                    name="name"
                    rules={[{ required: true, message: "Le nom est requis" }]}
                >
                    <Input placeholder="Nom du projet" />
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

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Ajouter
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}
