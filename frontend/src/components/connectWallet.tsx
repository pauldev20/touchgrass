"use client";

import { Button } from "@heroui/react";
import { useAppKit, useAppKitAccount, useAppKitState } from "@reown/appkit/react";

export default function ConnectWallet() {
    const { open: isOpened } = useAppKitState();
    const { isConnected } = useAppKitAccount();
    const { open } = useAppKit();

    if (isConnected) {
        return <w3m-account-button />;
    }

    return (
        <Button radius="lg" color="primary" onPress={() => open({ view: "Connect" })} isLoading={isOpened}>
            Connect Your Wallet
        </Button>
    );
}
