"use client";

import { useEffect, useState } from "react";
import { Card, Row, Col, Typography, Spin, Image } from "antd";
import Link from "next/link";
import { Project } from "@/model/Project";

const { Title, Paragraph } = Typography;

export default function ProjectListPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    console.log(projects);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/projects`
                );
                const data = await res.json();
                console.log(data);
                setProjects(data);
            } catch (err) {
                console.error("Erreur lors du chargement des projets :", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading)
        return <Spin style={{ display: "block", margin: "50px auto" }} />;

    return (
        <div style={{ padding: "40px" }}>
            <Title level={2}>Projets</Title>
            <Row gutter={[24, 24]}>
                {projects.map((project) => (
                    <Col key={project.id} xs={24} sm={12} md={8} lg={6}>
                        <Link href={`/projects/${project.id}`}>
                            <Card
                                hoverable
                                cover={
                                    <Image
                                        alt={project.title}
                                        // src={project.image[0]}
                                        style={{
                                            height: 200,
                                            objectFit: "cover",
                                        }}
                                    />
                                }
                            >
                                <Card.Meta
                                    title={project.title}
                                    description={
                                        <Paragraph ellipsis={{ rows: 2 }}>
                                            {project.description}
                                        </Paragraph>
                                    }
                                />
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
        </div>
    );
}
