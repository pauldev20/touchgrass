"use client";

import { Button, Card, CardFooter, Chip } from "@heroui/react";
import { useDisclosure } from "@heroui/react";
import RewardModal from "./modal";
import { useState } from "react";
import type { Reward } from "@prisma/client";


// const redeemableItems = [
//     {
//         id: 1,
//         title: "Premium NFT",
//         description: "Exclusive digital artwork collection",
//         image: "🎨",
//     },
//     {
//         id: 2,
//         title: "Event Ticket",
//         description: "VIP access to upcoming blockchain conference",
//         image: "🎟️",
//     },
//     {
//         id: 3,
//         title: "Digital Badge",
//         description: "Proof of community membership",
//         image: "🏅",
//     },
//     {
//         id: 4,
//         title: "Token Rewards",
//         description: "100 community tokens",
//         image: "🪙",
//     },
//     {
//         id: 5,
//         title: "Special Access",
//         description: "Early access to new features",
//         image: "🔑",
//     },
// ];

function ClaimCard({
    emoji,
    title,
    description,
    date,
    handleRedeem,
}: { emoji: string; title: string; description: string; date: string; handleRedeem: () => void }) {
    return (
        <Card className="h-[424px] w-[320px] border border-gray-700 bg-neutral-900" radius="sm">
            <div className="absolute top-0 left-0 right-0 flex items-start justify-center">
                <h1 className="text-[180px]">{emoji}</h1>
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

interface RewardsProps {
	rewards: Reward[];
}
export default function Rewards({ rewards }: RewardsProps) {
	const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [selectedItem, setSelectedItem] = useState<Reward | null>(null);

    const handleRedeem = (item: Reward) => {
        setSelectedItem(item);
        onOpen();
    };

    return (
        <section className="h-full z-20 flex flex-col items-center gap-[18px] sm:gap-6">
            {/* Redeem Cards */}
			{rewards.length === 0 && (
				<div className="text-center text-default-500">
					No rewards available
				</div>
			)}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rewards.map((item) => (
                    <ClaimCard
                        key={item.id}
                        emoji={item.emoji}
                        title={item.name}
                        description={item.description}
                        date={"22.03.2025"}
                        handleRedeem={() => handleRedeem(item)}
                    />
                ))}
            </div>

            {/* Verification Modal */}
			<RewardModal isOpen={isOpen} onOpenChange={onOpenChange} selectedItem={selectedItem!} />
        </section>
    );
}
