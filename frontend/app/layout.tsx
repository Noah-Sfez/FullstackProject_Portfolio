import "@ant-design/v5-patch-for-react-19";
import Menu from "@/components/Menu";
import Footer from "@/components/Footer";
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
                <Footer />
            </body>
        </html>
    );
}
