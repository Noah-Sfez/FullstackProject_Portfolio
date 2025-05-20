"use client";

import Head from "next/head";
import { Form, Input, Button, message } from "antd";
import { useState, useId, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { useRouter } from "next/router";

export default function SimpleRegisterPage() {
    /* --------------------------- State & refs --------------------------- */
    const [loading, setLoading] = useState(false);
    const titleId = useId();
    const cardRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();

    /* --------------------------- Animations (GSAP) --------------------------- */
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

    /* --------------------------- Submit handler --------------------------- */
    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const apiUrl =
                process.env.NEXT_PUBLIC_API_URL || "https://127.0.0.1:8000";
            const res = await fetch(`${apiUrl}/api/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: values.email,
                    roles: ["ROLE_USER"],
                    plainPassword: values.password,
                    name: values.lastName,
                    surname: values.firstName,
                }),
            });
            if (!res.ok)
                throw new Error("Erreur serveur, réessayez plus tard.");
            message.success("Inscription réussie ! 🎉");
            // TODO : redirection (router.push("/login"))
            router.push("/login");
        } catch (err: any) {
            message.error(err.message || "Une erreur est survenue");
        } finally {
            setLoading(false);
        }
    };
    const schemaOrg = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Inscription – École IIM (simple)",
        description:
            "Formulaire d'inscription simplifié pour rejoindre l'École IIM.",
        url: "https://ton-domaine.com/register-simple",
    };

    return (
        <>
            <Head>
                <title>Inscription | École XYZ</title>
                <meta
                    name="description"
                    content="Inscrivez-vous pour rejoindre l'École XYZ."
                />
                <link
                    rel="canonical"
                    href="https://ton-domaine.com/register-simple"
                />
                {/* Open Graph */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Inscription – École XYZ" />
                <meta
                    property="og:description"
                    content="Complétez votre inscription à l'École XYZ."
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
                className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-200/50 via-blue-100 to-indigo-300 px-4 py-10 overflow-hidden"
            >
                {/* blobs décoratifs */}
                <div className="pointer-events-none absolute -top-32 -left-28 h-80 w-80 rounded-full bg-indigo-300 opacity-30 blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 translate-x-1/3 translate-y-1/3 rounded-full bg-purple-300 opacity-20 blur-3xl" />

                {/* Carte glass */}
                <section
                    ref={cardRef}
                    className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white/70 p-6 shadow-2xl backdrop-blur-md md:p-8"
                >
                    <h1
                        id={titleId}
                        className="mb-8 text-center text-3xl font-extrabold text-indigo-700 md:text-4xl"
                    >
                        Inscription&nbsp;📝
                    </h1>

                    <Form
                        id="simple-register-form"
                        layout="vertical"
                        onFinish={onFinish}
                        autoComplete="off"
                        noValidate
                        aria-describedby="register-instructions"
                        className="grid gap-5"
                    >
                        <p id="register-instructions" className="sr-only">
                            Tous les champs sont obligatoires.
                        </p>

                        {/* Prénom */}
                        <Form.Item
                            label="Prénom"
                            name="firstName"
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
                                className="focus:ring-indigo-400"
                            />
                        </Form.Item>

                        {/* Nom */}
                        <Form.Item
                            label="Nom"
                            name="lastName"
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
                                className="focus:ring-indigo-400"
                            />
                        </Form.Item>

                        {/* Email */}
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

                        {/* Mot de passe */}
                        <Form.Item
                            label="Mot de passe"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Veuillez entrer un mot de passe",
                                },
                            ]}
                        >
                            <Input.Password
                                placeholder="••••••••"
                                autoComplete="new-password"
                                aria-required="true"
                                className="focus:ring-indigo-400"
                            />
                        </Form.Item>

                        {/* Bouton CTA */}
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
                                    S&#39;inscrire
                                </Button>
                            )}
                        </Form.Item>
                    </Form>
                </section>
            </main>
        </>
    );
}
