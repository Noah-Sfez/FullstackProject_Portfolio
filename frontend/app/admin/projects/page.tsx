"use client";

import { useEffect, useState } from "react";
import { Table, Button, Space, Popconfirm, Tag, message } from "antd";
import Link from "next/link";
import { Project } from "@/model/Project";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);

<<<<<<< Updated upstream
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
=======
    const fetchProjects = async () => {
        const res = await fetch("/api/projects");
        const text = await res.text();
        console.log("Réponse brute :", text);
        try {
            const data = JSON.parse(text);
            setProjects(data);
        } catch (error) {
            console.error("Erreur de parsing JSON :", error);
        }
    };
>>>>>>> Stashed changes

  useEffect(() => {
    fetchProjects();
  }, []);

<<<<<<< Updated upstream
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
=======
    const togglePublish = async (id: number, isActive: boolean) => {
        const res = await fetch(`/api/admin/projects/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isActive }),
        });

        if (res.ok) {
            message.success(`Projet ${isActive ? "publié" : "caché"}`);
            fetchProjects();
        } else {
            message.error("Erreur lors de la mise à jour");
        }
    };
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
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
=======
    const columns = [
        {
            title: "Title",
            dataIndex: "title",
            render: (record: Project) => (
                <Link href={`/admin/projects/${record.id}`}>
                    {record.title}
                </Link>
            ),
        },
        {
            title: "Statut",
            dataIndex: "isActive",
            render: (published: boolean) =>
                published ? (
                    <Tag color="green">Visible</Tag>
                ) : (
                    <Tag color="red">Caché</Tag>
                ),
        },
        {
            title: "Actions",
            render: (record: Project) => (
                <Space>
                    <Button
                        onClick={() =>
                            togglePublish(record.id, !record.isActive)
                        }
                    >
                        {record.isActive ? "Publier" : "Cacher"}
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
>>>>>>> Stashed changes

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
