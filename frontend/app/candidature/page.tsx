"use client";
// Page Inscription – optimisée SEO & Accessibilité ♿️📈
import Head from "next/head";
import { Form, Input, DatePicker, Select, Button, message } from "antd";
import { useState, useId } from "react";

const { Option } = Select;

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const titleId = useId();

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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

    // Structured data pour les moteurs de recherche
    const schemaOrg = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Inscription – École XYZ",
        description: "Formulaire d'inscription pour rejoindre l'École XYZ.",
        url: "https://ton-domaine.com/register",
    };

    return (
        <>
            {/* SEO */}
            <Head>
                <title>Inscription | École XYZ</title>
                <meta
                    name="description"
                    content="Formulaire d'inscription à l'École XYZ pour intégrer nos programmes."
                />
                <link rel="canonical" href="https://ton-domaine.com/register" />
                {/* Open Graph */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Inscription – École XYZ" />
                <meta
                    property="og:description"
                    content="Complétez votre inscription à l'École XYZ et lancez votre carrière."
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(schemaOrg),
                    }}
                />
            </Head>

            <main
                className="flex items-center justify-center mt-4 bg-gradient-to-br from-indigo-50 via-blue-100 to-indigo-200 overflow-hidden"
                aria-labelledby={titleId}
            >
                <div className="w-full h-screen w-screen max-w-md h-full bg-white/95 rounded-xl shadow-lg p-4 md:p-6 flex flex-col justify-center">
                    <h1
                        id={titleId}
                        className="text-2xl md:text-3xl font-bold text-center mb-4 md:mb-6 text-indigo-700"
                    >
                        Formulaire d&#39;inscription 📚
                    </h1>
                    <Form
                        id="register-form"
                        layout="vertical"
                        onFinish={onFinish}
                        autoComplete="off"
                        aria-describedby="form-instructions"
                        noValidate
                        className="flex flex-col flex-1 justify-center"
                    >
                        {/* Champ honeypot anti‑robots (invisible) */}
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
                            label="Nom complet"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Veuillez entrer votre nom complet",
                                },
                            ]}
                        >
                            <Input
                                placeholder="Jean Dupont"
                                allowClear
                                autoComplete="name"
                                aria-required="true"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Adresse e‑mail"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: "Veuillez entrer votre e‑mail",
                                },
                                {
                                    type: "email",
                                    message: "Format d'e‑mail invalide",
                                },
                            ]}
                        >
                            <Input
                                placeholder="jean.dupont@example.com"
                                allowClear
                                autoComplete="email"
                                type="email"
                                aria-required="true"
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
                            />
                        </Form.Item>

                        <Form.Item
                            label="Date de naissance"
                            name="dob"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Sélectionnez votre date de naissance",
                                },
                            ]}
                        >
                            <DatePicker
                                className="w-full"
                                format="DD/MM/YYYY"
                                aria-required="true"
                                inputReadOnly
                                placeholder="JJ/MM/AAAA"
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
                                    message: "Parlez‑nous de votre motivation",
                                },
                            ]}
                        >
                            <Input.TextArea
                                rows={2}
                                placeholder="Je souhaite rejoindre l’école car…"
                                aria-required="true"
                            />
                        </Form.Item>

                        <Form.Item shouldUpdate>
                            {() => (
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 border-none"
                                    size="large"
                                    disabled={loading}
                                    aria-disabled={loading}
                                >
                                    Soumettre l’inscription
                                </Button>
                            )}
                        </Form.Item>
                    </Form>
                </div>
            </main>
        </>
    );
}
