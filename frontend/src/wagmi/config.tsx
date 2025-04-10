import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { baseSepolia, flowTestnet, optimism } from "@reown/appkit/networks";
import { http, cookieStorage, createStorage } from "@wagmi/core";

export const projectId = "dc896b1fc1d55e11bd86be0ce6464cfc";

if (!projectId) {
    throw new Error("Project ID is not defined");
}

export const networks = [flowTestnet];

export const wagmiAdapter = new WagmiAdapter({
    storage: createStorage({
        storage: cookieStorage,
    }),
	transports: {
		[flowTestnet.id]: http()
	},
    ssr: true,
    projectId,
    networks,
});

export const config = wagmiAdapter.wagmiConfig;
