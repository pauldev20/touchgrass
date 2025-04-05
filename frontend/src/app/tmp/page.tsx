"use client";

import * as React from 'react';
import { Button } from "@heroui/react";
import { useAccount, useReadContract } from 'wagmi';

const NFT_ADDRESS = '0xf90B6FAe494c0573E530E1C7291C0bff83956332' as `0x${string}`;

// Add NFT contract configuration
const nftContract = {
	address: NFT_ADDRESS,
	abi: [
		{
			name: 'balanceOf',
			type: 'function',
			inputs: [{ name: 'owner', type: 'address' }],
			outputs: [{ name: '', type: 'uint256' }],
			stateMutability: 'view'
		}
	]
} as const;

const Tmp: React.FC = () => {
	const { address } = useAccount();
	const [isNFTHolder, setIsNFTHolder] = React.useState(false);

	// Read NFT balance
	const { data: nftBalance, isLoading: isNFTBalanceLoading } = useReadContract({
		address: nftContract.address,
		abi: nftContract.abi,
		functionName: 'balanceOf',
		args: [address as `0x${string}`],
        chainId: 10,
	});

	// Update NFT holder status whenever balance changes
	React.useEffect(() => {
		if (nftBalance) {
			setIsNFTHolder(Number(nftBalance) > 0);
		}
	}, [nftBalance]);

	return (
		<div className="p-4">
			<h2 className="text-xl font-bold mb-4">NFT Access Check</h2>
			{isNFTBalanceLoading ? (
				<p>Checking NFT ownership...</p>
			) : isNFTHolder ? (
				<p className="text-green-600 mb-4">✅ You are an NFT holder!</p>
			) : (
				<p className="text-red-600">❌ You need to own the NFT to access this feature</p>
			)}
		</div>
	);
};

export default Tmp;
