"use client";

import { useEffect, useState } from "react";
import { Table, Button, Space, Popconfirm, Tag, message } from "antd";
import Link from "next/link";

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState([]);

    const fetchProjects = async () => {
        const res = await fetch("/api/admin/projects");
        const data = await res.json();
        setProjects(data);
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const togglePublish = async (id: string, published: boolean) => {
        const res = await fetch(`/api/admin/projects/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ published }),
        });

        if (res.ok) {
            message.success(`Projet ${published ? "publié" : "caché"}`);
            fetchProjects();
        } else {
            message.error("Erreur lors de la mise à jour");
        }
    };

    const deleteProject = async (id: string) => {
        const res = await fetch(`/api/admin/projects/${id}`, {
            method: "DELETE",
        });

        if (res.ok) {
            message.success("Projet supprimé");
            fetchProjects();
        } else {
            message.error("Erreur lors de la suppression");
        }
    };

    const columns = [
        {
            title: "Nom",
            dataIndex: "name",
        },
        {
            title: "Statut",
            dataIndex: "published",
            render: (published: boolean) =>
                published ? (
                    <Tag color="green">Visible</Tag>
                ) : (
                    <Tag color="red">Caché</Tag>
                ),
        },
        {
            title: "Actions",
            render: (_: any, record: any) => (
                <Space>
                    <Button
                        onClick={() =>
                            togglePublish(record.id, !record.published)
                        }
                    >
                        {record.published ? "Cacher" : "Publier"}
                    </Button>
                    <Popconfirm
                        title="Supprimer définitivement ?"
                        onConfirm={() => deleteProject(record.id)}
                    >
                        <Button danger>Supprimer</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            <div style={{ marginBottom: 16 }}>
                <Link href="/admin/projects/new">
                    <Button type="primary">Nouveau projet</Button>
                </Link>
            </div>
            <Table rowKey="id" dataSource={projects} columns={columns} />
        </>
    );
}
