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
    <section className="flex flex-col items-center">
      <h1 className="text-5xl font-bold text-center mb-16">
        Claim Your Rewards
      </h1>
        
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {redeemableItems.map((item) => (
          <div 
            key={item.id} 
            className="group bg-background/40 backdrop-blur-sm rounded-3xl p-8 
              border border-default-200 hover:border-default-400
              transition-all duration-300"
          >
            <div className="flex flex-col items-center">
              <div className="text-6xl mb-8 transform group-hover:scale-110 transition-transform duration-300">
                {item.image}
              </div>
              <h2 className="text-2xl font-bold mb-3">
                {item.title}
              </h2>
              <p className="text-default-500 text-center mb-8 text-sm leading-relaxed">
                {item.description}
              </p>
              <button
                onClick={() => handleRedeem(item.id)}
                className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-medium 
                  hover:opacity-90 active:opacity-80 transition-all duration-200
                  transform group-hover:-translate-y-1"
              >
                Claim Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Verification Modal */}
      {isOpen && (
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
      )}
    </section>
  );
}
