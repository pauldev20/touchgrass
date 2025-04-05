"use client";

import * as React from 'react';
import { DateInput, Input, Button, Select, SelectItem, NumberInput } from "@heroui/react";
import { useSignMessage, useAccount } from 'wagmi';

type VerificationType = "wld" | "uber" | "nft" | "self";

interface VerificationElement {
	type: VerificationType;
	id: string;
	// Additional properties based on type
	address?: string;
	dateRange?: { start: string; end: string };
	coordinates?: { lat: number; lng: number };
	country?: string;
}

const Create: React.FC = () => {
	const { address } = useAccount();
	const { signMessageAsync } = useSignMessage();
	const [elements, setElements] = React.useState<VerificationElement[]>([]);
	const [selectedType, setSelectedType] = React.useState<VerificationType | null>(null);
	const [name, setName] = React.useState('');
	const [amount, setAmount] = React.useState<number>(0);

	// const options = useMemo(() => countryList().getData(), [])
	// const changeHandler = (value: any) => {
	// 	console.log(value)
	// }

	const addElement = () => {
		if (!selectedType) return;
		
		const newElement: VerificationElement = {
			type: selectedType,
			id: crypto.randomUUID(),
			dateRange: { start: '', end: '' }
		};
		
		setElements([...elements, newElement]);
		setSelectedType(null);
	};

	const removeElement = (id: string) => {
		setElements(elements.filter(el => el.id !== id));
	};

	const updateElement = (id: string, updates: Partial<VerificationElement>) => {
		setElements(elements.map(el => 
			el.id === id ? { ...el, ...updates } : el
		));
	};

	const submitData = async () => {
		try {
			// Create the config object without signature first
			const configData = {
				wallet: address, // Using connected wallet address instead of hardcoded
				name,
				amount,
				requirements: elements,
			};

			// Sign the stringified config
			const signature = await signMessageAsync({
				message: JSON.stringify(configData),
			});

			// Add signature to final config
			const config = {
				...configData,
				signature,
			};

			const response = await fetch('/api/config', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(config),
			});

			if (!response.ok) {
				throw new Error('Failed to save configuration');
			}

			const result = await response.json();
			console.log('Saved configuration:', result);
			
			// You might want to show a success message or redirect
		} catch (error) {
			console.error('Error saving configuration:', error);
			// Handle error (show error message to user)
		}
	};

	return (
		<div>
		<section className="h-full w-full z-20 flex flex-col items-center justify-start gap-4">
			<h1 className="text-2xl font-bold">Create Verification Requirements</h1>
			
			<div className="w-full flex flex-col gap-4">
				<div className="w-full flex flex-row gap-4">
					<Input 
						placeholder="Reward Name" 
						label="Reward Name"
						isRequired={true}
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<NumberInput 
						placeholder="Token Amount" 
						label="Reward Amount"
						isRequired={true}
						value={amount}
						onValueChange={(value) => setAmount(Number(value.toString().replace(/,/g, '')))}
					/>
				</div>

				<div className="w-full flex flex-row gap-4">
					<Select 
						value={selectedType || undefined}
						onChange={(e) => setSelectedType(e.target.value as VerificationType)}
						label="Add Verification"
						placeholder="Select type"
					>
						<SelectItem key="wld">World ID</SelectItem>
						<SelectItem key="uber">Uber</SelectItem>
						<SelectItem key="nft">NFT</SelectItem>
						<SelectItem key="self">Self Protocol</SelectItem>
					</Select>
					<Button onClick={addElement} disabled={!selectedType}>Add Element</Button>
				</div>
			</div>

			<div className="w-full flex flex-col gap-4">
				{elements.map((element) => (
					<div key={element.id} className="border p-4 rounded">
						<div className="flex justify-between items-center">
							<h3>{element.type.toUpperCase()}</h3>
							<Button color="danger" onClick={() => removeElement(element.id)}>Remove</Button>
						</div>

						{element.type === "nft" && (
							<Input 
								placeholder="NFT Contract Address" 
								value={element.address}
								onChange={(e) => updateElement(element.id, { address: e.target.value })}
							/>
						)}

						{element.type === "uber" && (
							<>
								<div className="flex gap-4">
									<DateInput
										label="Start Date"
										// onChange={(date) => updateElement(element.id, { 
										// 	dateRange: { ...element.dateRange, start: date?.toString() || '' } 
										// })}
									/>
									<DateInput
										label="End Date"
										// onChange={(date) => updateElement(element.id, { 
										// 	dateRange: { ...element.dateRange, end: date?.toString() || '' } 
										// })}
									/>
								</div>
								<img 
									src="/map.png"
									alt="Map visualization"
									width={600}
									height={300}
									className="rounded-lg mt-4"
								/>
							</>
						)}

						{element.type === "self" && (
							<div className="flex flex-col gap-4"></div>
						)}
					</div>
				))}
			</div>

			<Button color="primary" fullWidth={true} onPress={submitData}>Save Requirements</Button>
		</section>
		</div>
	);
};

export default Create;
