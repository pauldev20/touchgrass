"use client";

import { Button, Card, CardBody, CardFooter, CardHeader, Chip, Modal, ModalContent, ModalHeader } from "@heroui/react";
import { SelfBackendVerifier } from "@selfxyz/core";
import SelfQRcodeWrapper, { SelfAppBuilder } from "@selfxyz/qrcode";
import { useDisclosure } from "@heroui/react";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

// const selfBackendVerifier = new SelfBackendVerifier(
//     "my-app-scope",
//     "https://myapp.com/api/verify"
// );

const redeemableItems = [
    {
        id: 1,
        title: "Premium NFT",
        description: "Exclusive digital artwork collection",
        image: "🎨",
    },
    {
        id: 2,
        title: "Event Ticket",
        description: "VIP access to upcoming blockchain conference",
        image: "🎟️",
    },
    {
        id: 3,
        title: "Digital Badge",
        description: "Proof of community membership",
        image: "🏅",
    },
    {
        id: 4,
        title: "Token Rewards",
        description: "100 community tokens",
        image: "🪙",
    },
    {
        id: 5,
        title: "Special Access",
        description: "Early access to new features",
        image: "🔑",
    },
];

function ClaimCard({
    image,
    title,
    description,
    date,
    handleRedeem,
}: { image: string; title: string; description: string; date: string; handleRedeem: () => void }) {
    return (
        <Card className="h-[424px] w-[320px] border border-gray-700 bg-neutral-900" radius="sm">
            <div className="absolute top-0 left-0 right-0 flex items-start justify-center">
                <h1 className="text-[180px]">{image}</h1>
            </div>
            <Chip className="absolute top-2 right-2" variant="bordered" color="default" radius="sm" size="sm">
                {date}
            </Chip>
            <CardFooter className="flex flex-col items-start gap-2 mt-auto">
                <h2 className="text-2xl">{title}</h2>
                <p className="text-default-500 text-sm leading-relaxed line-clamp-2">{description}</p>
                <Button color="primary" fullWidth={true} onPress={() => handleRedeem()}>
                    Claim Reward
                </Button>
            </CardFooter>
        </Card>
    );
}

export default function Home() {
    const [userId, setUserId] = useState<string | null>(null);
	const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [selectedItem, setSelectedItem] = useState<number | null>(null);

    //   const selfApp = userId ? new SelfAppBuilder({
    //     appName: "My Application",
    //     scope: "my-app-scope",
    //     endpoint: "https://myapp.com/api/verify",
    //     userId,
    //   }).build() : null;

    const handleRedeem = (itemId: number) => {
        setSelectedItem(itemId);
        onOpen();
    };

    return (
        <section className="h-full z-20 flex flex-col items-center justify-center gap-[18px] sm:gap-6">
            {/* Redeem Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {redeemableItems.map((item) => (
                    <ClaimCard
                        key={item.id}
                        image={item.image}
                        title={item.title}
                        description={item.description}
                        date={"22.03.2025"}
                        handleRedeem={() => handleRedeem(item.id)}
                    />
                ))}
            </div>

            {/* Verification Modal */}
			<Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
				<ModalContent>
					<ModalHeader className="flex flex-col gap-1">
						<h1>Verify to Claim</h1>
						<p className="text-sm font-normal">Claiming: {redeemableItems.find(item => item.id === selectedItem)?.title}</p>
					</ModalHeader>
					
					<div className="bg-white rounded-2xl p-8 flex justify-center">
						{/* {selfApp && (
						<SelfQRcodeWrapper
							selfApp={selfApp}
							onSuccess={() => {
							console.log("Verification successful!");
							alert(`Successfully claimed ${redeemableItems.find(item => item.id === selectedItem)?.title}!`);
							setIsOpen(false);
							setSelectedItem(null);
							}}
							size={280}
						/>
						)} */}
					</div>
				</ModalContent>
			</Modal>
        </section>
    );
}
