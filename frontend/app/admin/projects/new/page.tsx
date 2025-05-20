"use client";

import { useState } from "react";
import {
    Form,
    Input,
    Button,
    message,
    Typography,
    DatePicker,
    Upload,
    Switch,
    InputNumber,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { getToken } from "@/utils/jwt";
import { Project } from "@/model/Project";

const { Title } = Typography;

export default function AddProject() {
    const [loading, setLoading] = useState(false);
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    const handleSubmit = async (values: Project) => {
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
                        title: values.title,
                        description: values.description,
                        date: values.date.valueOf(),
                        images: imageUrls,
                        isActive: values.isActive,
                        link: values.link,
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

    const handleImageUpload = (info: any) => {
        const uploadedFiles = info.fileList
            .filter((file: any) => file.status === "done" && file.response?.url)
            .map((file: any) => file.response.url);

        setImageUrls(uploadedFiles);
    };

    return (
        <>
            <Title level={2}>Ajout d’un projet</Title>

            <Form layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    label="Titre"
                    name="title"
                    rules={[{ required: true, message: "Le titre est requis" }]}
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
                    rules={[{ required: true, message: "La date est requise" }]}
                >
                    <InputNumber />
                </Form.Item>

                <Form.Item
                    label="Lien externe (site, dépôt, etc.)"
                    name="link"
                    rules={[{ required: true, message: "Le lien est requis" }]}
                >
                    <Input placeholder="https://..." />
                </Form.Item>

                <Form.Item label="Images (plusieurs possibles)">
                    <Upload
                        name="file"
                        action={`${process.env.NEXT_PUBLIC_API_URL}/api/upload`}
                        onChange={handleImageUpload}
                        multiple
                        listType="picture"
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
                >
                    <Switch />
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
