"use client";

import { useEffect, useState } from "react";
import { Table, Button, Space, Popconfirm, Tag, message } from "antd";
import Link from "next/link";
import { Project } from "@/model/Project";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`);
    const text = await res.text();
    console.log("Réponse brute :", text);
    try {
      const data = JSON.parse(text);
      setProjects(data["hydra:member"] || data);
    } catch (error) {
      console.error("Erreur de parsing JSON :", error);
    }
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
      render: (record: Project) => (
        <Link href={`/admin/projects/${record.id}`}>{record.title}</Link>
      ),
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
      render: (_: any, record: Project) => (
        <Space>
          <Button onClick={() => togglePublish(record.id, !record.isActive)}>
            {record.isActive ? "Cacher" : "Publier"}
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
