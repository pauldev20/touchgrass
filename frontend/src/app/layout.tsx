import "@/styles/globals.css";
import { siteConfig } from "@/config/site";
import clsx from "clsx";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { Providers } from "./providers";

import CustomNavbar from "@/components/navbar";

const fontSans = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
});

export const metadata: Metadata = {
    title: {
        default: siteConfig.name,
        template: `%s - ${siteConfig.name}`,
    },
    description: siteConfig.description,
};

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "white" },
        { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookies = (await headers()).get("cookie");

    return (
        <html suppressHydrationWarning={true} lang="en">
            <head />
            <body className={clsx("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
                <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }} cookies={cookies}>
                    <div className="relative flex h-dvh w-full flex-col overflow-hidden bg-background">
                        <CustomNavbar />
                        <main className="container mx-auto flex flex-1 flex-col items-center overflow-auto justify-start px-8">
                            {children}
                        </main>
                    </div>
                </Providers>
            </body>
        </html>
    );
}
