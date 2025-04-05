"use client";

import WagmiProvider from "@/wagmi/provider";
import { HeroUIProvider } from "@heroui/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import { useRouter } from "next/navigation";

export interface ProvidersProps {
    children: React.ReactNode;
    themeProps?: ThemeProviderProps;
    cookies: string | null;
}

declare module "@react-types/shared" {
    interface RouterConfig {
        routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>["push"]>[1]>;
    }
}

export function Providers({ children, themeProps, cookies }: ProvidersProps) {
    const router = useRouter();

    return (
        <HeroUIProvider navigate={router.push}>
            <WagmiProvider cookies={cookies}>
                <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
            </WagmiProvider>
        </HeroUIProvider>
    );
}
