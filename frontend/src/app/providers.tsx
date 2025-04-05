"use client";

import WagmiProvider from "@/wagmi/provider";
import { HeroUIProvider } from "@heroui/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import { useRouter } from "next/navigation";
import { Toaster } from 'react-hot-toast';

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
		<WagmiProvider cookies={cookies}>
			<HeroUIProvider navigate={router.push}>
				<NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
			</HeroUIProvider>
			<Toaster />
		</WagmiProvider>
    );
}
