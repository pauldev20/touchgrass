"use client";

import { siteConfig } from "@/config/site";
import { baseSepolia } from "@reown/appkit/networks";
import { createAppKit } from "@reown/appkit/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { type ReactNode } from "react";
import { type Config, WagmiProvider, cookieToInitialState } from "wagmi";
import { projectId, wagmiAdapter } from "./config";

const queryClient = new QueryClient();

if (!projectId) {
    throw new Error("Project ID is not defined");
}

// Set up metadata
const metadata = {
    name: siteConfig.name,
    description: siteConfig.description,
    url: "https://reown.com/appkit",
    icons: ["https://assets.reown.com/reown-profile-pic.png"],
};

createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    networks: [baseSepolia],
    defaultNetwork: baseSepolia,
    metadata: metadata,
    features: {
        analytics: false,
    },
});

function ContextProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
    const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies);

    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    );
}

export default ContextProvider;
