'use client';

import React, { useState, useEffect } from 'react';
import SelfQRcodeWrapper, { SelfAppBuilder } from '@selfxyz/qrcode';
import { v4 as uuidv4 } from 'uuid';
import { SelfBackendVerifier } from '@selfxyz/core';

const selfBackendVerifier = new SelfBackendVerifier(
    "my-app-scope",
    "https://myapp.com/api/verify"
);

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

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setUserId(uuidv4());
    }
  }, [isOpen]);

  const selfApp = userId ? new SelfAppBuilder({
    appName: "My Application",
    scope: "my-app-scope",
    endpoint: "https://myapp.com/api/verify",
    userId,
  }).build() : null;

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
    <section className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-black">Redeemable Items</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {redeemableItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col">
            <div className="text-4xl mb-4 text-center text-black">{item.image}</div>
            <h2 className="text-xl font-semibold mb-2 text-black">{item.title}</h2>
            <p className="text-black flex-grow mb-4">{item.description}</p>
            <button
              onClick={() => handleRedeem(item.id)}
              className="bg-white text-black px-4 py-2 rounded-lg border border-black hover:bg-gray-100 transition-colors"
            >
              Redeem
            </button>
          </div>
        ))}
      </div>

      {/* Verification Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleModalClick}
        >
          <div className="verification-container bg-white p-8 rounded-lg shadow-md relative max-w-md w-full mx-4">
            <button
              onClick={() => {
                setIsOpen(false);
                setSelectedItem(null);
              }}
              className="absolute top-4 right-4 text-black hover:text-gray-700"
            >
              ✕
            </button>
            
            <h2 className="text-black text-xl mb-2">Verify to Redeem</h2>
            <p className="text-black mb-4">
              Redeeming: {redeemableItems.find(item => item.id === selectedItem)?.title}
            </p>
            
            <div className="bg-white p-4">
              {selfApp && (
                <SelfQRcodeWrapper
                  selfApp={selfApp}
                  onSuccess={() => {
                    console.log("Verification successful!");
                    alert(`Successfully redeemed ${redeemableItems.find(item => item.id === selectedItem)?.title}!`);
                    setIsOpen(false);
                    setSelectedItem(null);
                  }}
                  size={300}
                />
              )}
            </div>
            
            <p className="text-sm text-black">
              User ID: {userId?.substring(0, 8)}...
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
