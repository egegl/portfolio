import type { Metadata } from "next";
import { EB_Garamond } from "next/font/google";
import "./globals.css";

const ebGaramond = EB_Garamond({
    subsets: ["latin"],
    variable: "--font-eb-garamond",
});

export const metadata: Metadata = {
    title: "Ege Gursel",
    description: "Personal website of Ege Gürsel",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className={`${ebGaramond.variable}`}>
        {children}
        </body>
        </html>
    );
}