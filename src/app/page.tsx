'use client';

import React, { useState, useEffect } from 'react';
import SelfQRcodeWrapper, { SelfAppBuilder } from '@selfxyz/qrcode';
import { v4 as uuidv4 } from 'uuid';
import { SelfBackendVerifier } from '@selfxyz/core';

const selfBackendVerifier = new SelfBackendVerifier(
    "my-app-scope", // the scope that you chose to identify your app
    "https://myapp.com/api/verify" // The API endpoint of this backend
);

export default function Home() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Generate a user ID when the component mounts
    setUserId(uuidv4());
  }, []);

  if (!userId) return null;

  // Create the SelfApp configuration
  const selfApp = new SelfAppBuilder({
    appName: "My Application",
    scope: "my-app-scope",
    endpoint: "https://myapp.com/api/verify",
    userId,
  }).build();

  return (
    <div className="verification-container bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-black">Verify Your Identity</h1>
      <p className="text-gray-700">Scan this QR code with the Self app to verify your identity</p>
      
      <div className="bg-white p-4">
        <SelfQRcodeWrapper
          selfApp={selfApp}
          onSuccess={() => {
            console.log("Verification successful!");
          }}
          size={350}
        />
      </div>
      
      <p className="text-sm text-gray-500">
        User ID: {userId.substring(0, 8)}...
      </p>
    </div>
  );
}
