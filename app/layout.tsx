import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
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
            <head>
                {/* Ensure proper mobile scaling */}
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </head>
            <body className={`${inter.variable}`}>
                {children}
            </body>
        </html>
    );
}