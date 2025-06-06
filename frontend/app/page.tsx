"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, Row, Col, Typography, Spin, Image, Carousel, Rate } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Project } from "@/model/Project";

const { Title, Paragraph } = Typography;

export default function ProjectHomePage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/projects`
                );
                const data = await res.json();
                const rawProjects = Array.isArray(data.member)
                    ? data.member
                    : [];
                setProjects(rawProjects.filter((p: Project) => p.isActive));
            } catch (err) {
                console.error("Erreur lors du chargement des projets :", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const topProjects = useMemo(() => projects.slice(0, 3), [projects]);

    const getRandomRate = () => {
        const rates = [4, 4.5, 5];
        return rates[Math.floor(Math.random() * rates.length)];
    };

    if (loading)
        return (
            <Spin
                style={{ display: "block", margin: "50px auto" }}
                size="large"
            />
        );

    return (
        <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-indigo-200/50 via-orange-100 to-indigo-300 text-white">
            <div className="relative h-[100vh] w-full overflow-hidden">
                <video
                    className="absolute top-0 left-0 h-full w-full object-cover pointer-events-none"
                    src="/video_home.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                />
                <header className="relative flex h-full w-full items-center justify-center bg-black/50 p-4 text-center">
                    <h1 className="drop-shadow-xl md:text-6xl text-4xl font-extrabold">
                        Projets Étudiants IIM
                    </h1>
                </header>
            </div>

            <section className="mx-auto max-w-7xl px-4 py-12">
                <Title
                    level={2}
                    className="!text-white mb-6 text-center font-bold capitalize"
                >
                    Découvre les derniers projets
                </Title>
                <Carousel
                    autoplay
                    draggable
                    dots
                    slidesToShow={3}
                    responsive={[
                        {
                            breakpoint: 1024,
                            settings: { slidesToShow: 2 },
                        },
                        {
                            breakpoint: 600,
                            settings: { slidesToShow: 1 },
                        },
                    ]}
                    arrows
                    prevArrow={
                        <button className="custom-arrow left">
                            <LeftOutlined />
                        </button>
                    }
                    nextArrow={
                        <button className="custom-arrow right">
                            <RightOutlined />
                        </button>
                    }
                >
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="flex justify-center items-center min-h-[400px]"
                        >
                            <Link href={`/projects/${project.id}`}>

                                <Card
                                    hoverable
                                    className="transition-transform duration-300 hover:scale-105"
                                    style={{ width: 350, maxWidth: "90%" }}
                                    cover={
                                        <Image
                                            alt={project.title}
                                            src={`${process.env.NEXT_PUBLIC_API_URL}${project.media[0]?.contentUrl}`}
                                            preview={false}
                                            style={{
                                                height: 350,
                                                objectFit: "cover",
                                            }}
                                        />
                                    }
                                >
                                    <Card.Meta
                                        title={project.title}
                                        description={
                                            <Paragraph ellipsis={{ rows: 3 }}>
                                                {project.description}
                                            </Paragraph>
                                        }
                                    />
                                </Card>
                            </Link>
                        </div>
                    ))}
                </Carousel>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-12">
                <Title
                    level={2}
                    className="!text-white mb-6 text-center font-bold capitalize"
                >
                    Les top projets ⭐️
                </Title>
                <Row gutter={[24, 24]} justify="center">
                    {topProjects.map((project) => (
                        <Col
                            key={project.id}
                            xs={24}
                            sm={12}
                            md={8}
                            lg={6}
                            xl={5}
                        >
                            <Link href={`/projects/${project.id}`}>
                                <Card
                                    hoverable
                                    cover={
                                        <Image
                                            alt={project.title}
                                            src={`${process.env.NEXT_PUBLIC_API_URL}${project.media[0]?.contentUrl}`}
                                            preview={false}
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
                                    <div className="mt-2 flex justify-center">
                                        <Rate
                                            defaultValue={getRandomRate()}
                                            disabled
                                            allowHalf
                                        />
                                    </div>
                                </Card>
                            </Link>
                        </Col>
                    ))}
                </Row>
            </section>
        </div>
    );
}
