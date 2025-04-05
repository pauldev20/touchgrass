"use client";

import { Button, Card, CardBody, CardFooter, CardHeader, Chip } from "@heroui/react";
import { SelfBackendVerifier } from "@selfxyz/core";
import SelfQRcodeWrapper, { SelfAppBuilder } from "@selfxyz/qrcode";
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
    const [isOpen, setIsOpen] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<number | null>(null);

    useEffect(() => {
        if (isOpen) {
            setUserId(uuidv4());
        }
    }, [isOpen]);

    //   const selfApp = userId ? new SelfAppBuilder({
    //     appName: "My Application",
    //     scope: "my-app-scope",
    //     endpoint: "https://myapp.com/api/verify",
    //     userId,
    //   }).build() : null;

    const handleRedeem = (itemId: number) => {
        setSelectedItem(itemId);
        setIsOpen(true);
    };

    const handleModalClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            setIsOpen(false);
            setSelectedItem(null);
        }
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
			
            {/* {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleModalClick}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl relative max-w-md w-full mx-auto"
          >
            <div className="p-10">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setSelectedItem(null);
                }}
                className="absolute top-8 right-8 text-gray-500 hover:text-gray-700 
                  transition-colors p-2 hover:bg-gray-100 rounded-full"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-3 text-black">
                  Verify to Claim
                </h2>
                <p className="text-gray-500">
                  Claiming: {redeemableItems.find(item => item.id === selectedItem)?.title}
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-8 flex justify-center">
                {selfApp && (
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
                )}
              </div>
              
              <p className="text-sm text-gray-500 mt-6 text-center">
                ID: {userId?.substring(0, 8)}...
              </p>
            </div>
          </div>
        </div>
      )} */}
        </section>
    );
}
