"use client";

import { useEffect, useState } from "react";
import { Layout, Menu as AntMenu, Button } from "antd";
import Link from "next/link";
import { getSession, logout } from "@/utils/jwt";
import { useRouter } from "next/navigation";

const { Header } = Layout;

export default function Menu() {
    const [isLogged, setIsLogged] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();

    const fetchSession = async () => {
        const session = await getSession();
        console.log("Session:", session);
        if (session) {
            setIsLogged(true);
            setIsAdmin(session.roles.includes("ROLE_ADMIN"));
        }
    };

    const handleLogout = async () => {
        await logout();
        setIsLogged(false);
        setIsAdmin(false);
        router.push("/");
    };

    useEffect(() => {
        fetchSession();
    }, []);

    const items = [
        { label: <Link href="/">Accueil</Link>, key: "home" },
        {
            label: <Link href="/candidature">Candidature</Link>,
            key: "candidature",
        },
        !isLogged && {
            label: <Link href="/login">Connexion</Link>,
            key: "login",
        },
        !isLogged && {
            label: <Link href="/register">Inscription</Link>,
            key: "register",
        },
        {
            label: <Link href="/admin/projects">Admin</Link>,
            key: "admin",
        },
        isLogged && {
            label: (
                <Button
                    type="link"
                    danger
                    onClick={handleLogout}
                    style={{ padding: 0 }}
                >
                    Déconnexion
                </Button>
            ),
            key: "logout",
        },
    ].filter(Boolean);

    return (
        <Header style={{ backgroundColor: "#fff", padding: "0 24px" }}>
            <AntMenu mode="horizontal" items={items} />
        </Header>
    );
}
