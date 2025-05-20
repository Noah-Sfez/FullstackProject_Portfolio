import "@ant-design/v5-patch-for-react-19";
import Menu from "@/components/Menu";
import "./globals.css";

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
