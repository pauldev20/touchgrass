"use client";

import * as React from 'react';
import { DateInput, Input, Button, Select, SelectItem, NumberInput } from "@heroui/react";
import { useSignMessage, useAccount, useReadContract, useWriteContract } from 'wagmi';
import { parseUnits } from 'viem';

const USDC_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e' as `0x${string}`;
const ALLOW_ADDRESS = '0x0880F49F371d8518f608D6e42c103acd020F007A' as `0x${string}`;

const Fund: React.FC = () => {
	const { address } = useAccount();
	const [rewards, setRewards] = React.useState<any[]>([]);

	// Fetch rewards
	React.useEffect(() => {
		const fetchRewards = async () => {
			try {
				const response = await fetch('/api/config');
				const data = await response.json();
				// Filter rewards by user's wallet address
				setRewards(data.rewards.filter((reward: any) => 
					reward.wallet.toLowerCase() === address?.toLowerCase()
				));
			} catch (error) {
				console.error('Error fetching rewards:', error);
			}
		};

		if (address) {
			fetchRewards();
		}
	}, [address]);

	// USDC Contract configuration (you'll need to replace with actual USDC contract address)
	const usdcContract = {
		address: USDC_ADDRESS, // USDC contract address
		abi: [
			{
				name: 'allowance',
				type: 'function',
				inputs: [
					{ name: 'owner', type: 'address' },
					{ name: 'spender', type: 'address' }
				],
				outputs: [{ name: '', type: 'uint256' }],
				stateMutability: 'view'
			},
			{
				name: 'approve',
				type: 'function',
				inputs: [
					{ name: 'spender', type: 'address' },
					{ name: 'amount', type: 'uint256' }
				],
				outputs: [{ name: '', type: 'bool' }],
				stateMutability: 'nonpayable'
			}
		]
	};

	// Read allowance
	const { data: allowance, isLoading: isAllowanceLoading } = useReadContract({
		address: usdcContract.address,
		abi: usdcContract.abi,
		functionName: 'allowance',
		args: [address as `0x${string}`, ALLOW_ADDRESS],
	});

	const { writeContractAsync } = useWriteContract();

    const handleApprove = async () => {
        try {
            console.log("not working")
            const tx = await writeContractAsync({
                address: USDC_ADDRESS,
                abi: usdcContract.abi,
                functionName: 'approve',
                args: [ALLOW_ADDRESS, parseUnits('1000', 6)],
            });
            console.log('Approve transaction sent:', tx);
        } catch (err) {
            console.error('Approve transaction failed:', err);
        }
    };

	return (
		<div className="p-4">
			<h2 className="text-xl font-bold mb-4">My Rewards</h2>
			{rewards.map((reward, index) => (
				<div key={index} className="mb-4 p-4 border rounded">
					<h3>{reward.name}</h3>
					<p>{reward.description}</p>
					<span>{reward.emoji}</span>
				</div>
			))}

			<div className="mt-8">
				<h2 className="text-xl font-bold mb-4">USDC Allowance</h2>
				<p>
					Current allowance: {
						isAllowanceLoading 
							? "Loading..." 
							: `${allowance ? Number(allowance) / 1e6 : 0} USDC`
					}
				</p>
				<Button 
					onClick={handleApprove}
					className="mt-2"
				>
					Approve More USDC
				</Button>
			</div>
		</div>
	);
};

export default Fund;
