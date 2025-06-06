"use client";
import Head from "next/head";
import { Form, Input, DatePicker, Select, Button, message } from "antd";
import { useState, useId, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const { Option } = Select;

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const titleId = useId();
    const cardRef = useRef<HTMLDivElement | null>(null);

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

            gsap.from(".gsap-field", {
                opacity: 0,
                x: -40,
                stagger: 0.1,
                duration: 0.6,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: cardRef.current,
                    start: "top 80%",
                },
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

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const apiUrl =
                process.env.NEXT_PUBLIC_API_URL || "https://127.0.0.1:8000";
            const res = await fetch(`${apiUrl}/api/candidates`, {
                method: "POST",
                headers: { "Content-Type": "application/ld+json" },
                body: JSON.stringify(values),
            });
            if (!res.ok)
                throw new Error("Erreur serveur, réessayez plus tard.");
            message.success("Inscription réussie ! 🎉");
        } catch (err: any) {
            message.error(err.message || "Une erreur est survenue");
        } finally {
            setLoading(false);
        }
    };

    const schemaOrg = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Inscription – École IIM",
        description: "Formulaire d'inscription pour rejoindre l'École IIM.",
        url: "https://ton-domaine.com/register",
    };

    return (
        <>
            <Head>
                <title>Inscription | École IIM</title>
                <meta
                    name="description"
                    content="Formulaire d'inscription à l'École IIM pour intégrer nos programmes."
                />
                <link rel="canonical" href="https://ton-domaine.com/register" />

                <meta property="og:type" content="website" />
                <meta property="og:title" content="Inscription – École IIM" />
                <meta
                    property="og:description"
                    content="Complétez votre inscription à l'École IIM et lancez votre carrière."
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(schemaOrg),
                    }}
                />
            </Head>

            <main
                aria-labelledby={titleId}
                className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-200/50 via-orange-100 to-indigo-300 px-4 py-10 overflow-hidden"
            >
                <div className="pointer-events-none absolute -top-32 -left-28 h-80 w-80 rounded-full bg-indigo-300 opacity-30 blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 translate-x-1/3 translate-y-1/3 rounded-full bg-purple-300 opacity-20 blur-3xl" />

                <section
                    ref={cardRef}
                    className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white/70 p-6 shadow-2xl backdrop-blur-md md:p-8"
                >
                    <h1
                        id={titleId}
                        className="mb-8 text-center text-3xl font-extrabold text-indigo-700 md:text-4xl"
                    >
                        Formulaire de candidature&nbsp;📚
                    </h1>

                    <Form
                        id="register-form"
                        layout="vertical"
                        onFinish={onFinish}
                        autoComplete="off"
                        noValidate
                        aria-describedby="form-instructions"
                        className="grid gap-5"
                    >
                        <input
                            type="checkbox"
                            tabIndex={-1}
                            autoComplete="off"
                            name="website"
                            className="hidden"
                        />
                        <p id="form-instructions" className="sr-only">
                            Tous les champs marqués obligatoire doivent être
                            remplis.
                        </p>
                        <Form.Item
                            label="Prénom"
                            name="surname"
                            rules={[
                                {
                                    required: true,
                                    message: "Veuillez entrer votre prénom",
                                },
                            ]}
                        >
                            <Input
                                placeholder="Jean"
                                allowClear
                                autoComplete="given-name"
                                aria-required="true"
                                className="focus:ring-indigo-400 gsap-field"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Nom"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: "Veuillez entrer votre nom",
                                },
                            ]}
                        >
                            <Input
                                placeholder="Dupont"
                                allowClear
                                autoComplete="family-name"
                                aria-required="true"
                                className="focus:ring-indigo-400 gsap-field"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Adresse e-mail"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: "Veuillez entrer votre e-mail",
                                },
                                {
                                    type: "email",
                                    message: "Format d'e-mail invalide",
                                },
                            ]}
                        >
                            <Input
                                type="email"
                                placeholder="jean.dupont@example.com"
                                allowClear
                                autoComplete="email"
                                aria-required="true"
                                className="focus:ring-indigo-400"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Téléphone"
                            name="phone"
                            rules={[
                                {
                                    required: true,
                                    message: "Veuillez entrer votre téléphone",
                                },
                                {
                                    pattern: /^(\+?\d{1,3}[- ]?)?\d{6,14}$/,
                                    message: "Numéro invalide",
                                },
                            ]}
                        >
                            <Input
                                placeholder="+33 6 12 34 56 78"
                                allowClear
                                autoComplete="tel"
                                inputMode="tel"
                                aria-required="true"
                                className="focus:ring-indigo-400"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Programme souhaité"
                            name="program"
                            rules={[
                                {
                                    required: true,
                                    message: "Choisissez un programme",
                                },
                            ]}
                        >
                            <Select
                                placeholder="Choisissez…"
                                allowClear
                                aria-required="true"
                                optionFilterProp="children"
                                className="[&_.ant-select-selector]:focus:ring-indigo-400"
                            >
                                <Option value="web">
                                    Bachelor Développement Web
                                </Option>
                                <Option value="design">
                                    Bachelor Design & Création
                                </Option>
                                <Option value="marketing">
                                    Bachelor Marketing Digital
                                </Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Motivation"
                            name="motivation"
                            rules={[
                                {
                                    required: true,
                                    message: "Parlez-nous de votre motivation",
                                },
                            ]}
                        >
                            <Input.TextArea
                                rows={2}
                                placeholder="Je souhaite rejoindre l’école car…"
                                aria-required="true"
                                className="focus:ring-indigo-400"
                            />
                        </Form.Item>
                        <Form.Item shouldUpdate>
                            {() => (
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    disabled={loading}
                                    aria-disabled={loading}
                                    size="large"
                                    className="cta-btn mt-2 w-full transform rounded-lg bg-indigo-600 transition hover:-translate-y-0.5 hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400/50 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    Soumettre l’inscription
                                </Button>
                            )}
                        </Form.Item>
                    </Form>
                </section>
            </main>
        </>
    );
}
