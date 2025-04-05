import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
const config = {
    content: [
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-sans)"],
            },
        },
        backgroundImage: {
            "hero-section-title": "linear-gradient(91deg, #FFF 32.88%, rgba(255, 255, 255, 0.40) 99.12%)",
        },
    },
    darkMode: "class",
    plugins: [heroui()],
};

module.exports = config;
