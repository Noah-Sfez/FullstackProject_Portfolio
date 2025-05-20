"use client";
/* Page Connexion animée avec GSAP ✨
   --------------------------------------------------
   ➡️ Dépendances :
      - Tailwind CSS (déjà configuré dans ton projet)
      - Ant Design
      - GSAP (`npm i gsap`)

   Cette page reprend la même esthétique "glass-morphism" et les animations
   (fade-in, stagger, pulse) que la page d'inscription, mais adaptée
   à une authentification simple (e-mail + mot de passe).
*/

import Head from "next/head";
import { Form, Input, Button, message, Checkbox } from "antd";
import { useState, useId, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ―――― 1. Enregistre le plugin ―――― */
gsap.registerPlugin(ScrollTrigger);

export default function LoginPage() {
    /* ------------- State & Refs ------------- */
    const [loading, setLoading] = useState(false);
    const titleId = useId();
    const cardRef = useRef<HTMLDivElement | null>(null);

    /* ------------- Animations GSAP ------------- */
    useLayoutEffect(() => {
        // Accessibilité : on respecte prefers-reduced-motion
        const prefersReduced = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        if (prefersReduced) return;

        const ctx = gsap.context(() => {
            /* (1) Carte qui apparaît */
            gsap.from(cardRef.current, {
                opacity: 0,
                y: 60,
                duration: 0.8,
                ease: "power2.out",
            });

            /* (2) Cascade des champs */
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

            /* (3) Pulse sur le bouton */
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

    /* ------------- Handler formulaire ------------- */
    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const apiUrl =
                process.env.NEXT_PUBLIC_API_URL || "https://127.0.0.1:8000";
            const res = await fetch(`${apiUrl}/auth`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            if (!res.ok)
                throw new Error("Identifiants incorrects ou erreur serveur.");
            message.success("Connexion réussie ! 👋");
            // TODO : redirige l'utilisateur si besoin (router.push("/admin/projects"))
        } catch (err: any) {
            message.error(err.message || "Une erreur est survenue");
        } finally {
            setLoading(false);
        }
    };

    /* ------------- Structured Data (SEO) ------------- */
    const schemaOrg = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Connexion – École XYZ",
        description:
            "Page de connexion sécurisée pour accéder à l'espace étudiant de l'École XYZ.",
        url: "https://ton-domaine.com/login",
    };

    /* ------------- JSX ------------- */
    return (
        <>
            {/* SEO */}
            <Head>
                <title>Connexion | École XYZ</title>
                <meta
                    name="description"
                    content="Connectez-vous pour accéder à votre espace étudiant."
                />
                <link rel="canonical" href="https://ton-domaine.com/login" />
                {/* Open Graph */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Connexion – École XYZ" />
                <meta
                    property="og:description"
                    content="Accédez à votre espace sécurisé à l'École XYZ."
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(schemaOrg),
                    }}
                />
            </Head>

            {/* Fond gradient + blobs */}
            <main
                aria-labelledby={titleId}
                className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-200/50 via-blue-100 to-indigo-300 px-4 py-10 overflow-hidden"
            >
                <div className="pointer-events-none absolute -top-32 -left-28 h-80 w-80 rounded-full bg-indigo-300 opacity-30 blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 translate-x-1/3 translate-y-1/3 rounded-full bg-purple-300 opacity-20 blur-3xl" />

                {/* Carte « glass » */}
                <section
                    ref={cardRef}
                    className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white/70 p-6 shadow-2xl backdrop-blur-md md:p-8"
                >
                    <h1
                        id={titleId}
                        className="mb-8 text-center text-3xl font-extrabold text-indigo-700 md:text-4xl"
                    >
                        Connexion&nbsp;🔐
                    </h1>

                    <Form
                        id="login-form"
                        layout="vertical"
                        onFinish={onFinish}
                        autoComplete="off"
                        noValidate
                        aria-describedby="login-instructions"
                        className="grid gap-5"
                    >
                        <p id="login-instructions" className="sr-only">
                            Entrez votre e-mail et votre mot de passe pour vous
                            connecter.
                        </p>

                        {/* Champ e-mail */}
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
                                className="gsap-field focus:ring-indigo-400"
                            />
                        </Form.Item>

                        {/* Champ mot de passe */}
                        <Form.Item
                            label="Mot de passe"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Veuillez entrer votre mot de passe",
                                },
                            ]}
                        >
                            <Input.Password
                                placeholder="••••••••"
                                autoComplete="current-password"
                                aria-required="true"
                                className="gsap-field focus:ring-indigo-400"
                            />
                        </Form.Item>

                        {/* Souviens-toi de moi 
                        <Form.Item
                            name="remember"
                            valuePropName="checked"
                            className="m-0"
                        >
                            <Checkbox className="gsap-field">
                                Se souvenir de moi
                            </Checkbox>
                        </Form.Item>
                            */}
                        {/* Bouton */}
                        <Form.Item shouldUpdate>
                            {() => (
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    disabled={loading}
                                    aria-disabled={loading}
                                    size="large"
                                    className="cta-btn mt-4 w-full transform rounded-lg bg-indigo-600 transition hover:-translate-y-0.5 hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400/50 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    Se connecter
                                </Button>
                            )}
                        </Form.Item>
                    </Form>
                </section>
            </main>
        </>
    );
}
