import Menu from "@/components/Menu";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr">
            <body>
                <Menu />
                {children}
            </body>
        </html>
    );
}
