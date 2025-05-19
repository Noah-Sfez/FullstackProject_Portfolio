"use client";

import { Form, Input, DatePicker, Select, Button, message } from "antd";
import { useState } from "react";

const { Option } = Select;

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);

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

    return (
        <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-100 to-indigo-200 overflow-hidden">
            <div className="w-full max-w-md bg-white/90 rounded-xl shadow-lg p-4">
                <h1 className="text-2xl font-bold text-center mb-4 text-indigo-700">
                    Formulaire d&#39;inscription 📚
                </h1>

                <Form layout="vertical" onFinish={onFinish} autoComplete="off">
                    <Form.Item
                        label="Nom complet"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Veuillez entrer votre nom complet",
                            },
                        ]}
                    >
                        <Input placeholder="Jean Dupont" allowClear />
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
                        <Input placeholder="+33 6 12 34 56 78" allowClear />
                    </Form.Item>

                    <Form.Item
                        label="Date de naissance"
                        name="dob"
                        rules={[
                            {
                                required: true,
                                message: "Sélectionnez votre date de naissance",
                            },
                        ]}
                    >
                        <DatePicker className="w-full" format="DD/MM/YYYY" />
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
                        <Select placeholder="Choisissez…" allowClear>
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
                            rows={4}
                            placeholder="Je souhaite rejoindre l’école car…"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 border-none"
                            size="large"
                        >
                            Soumettre l’inscription
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}
