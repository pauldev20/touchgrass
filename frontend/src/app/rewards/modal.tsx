"use client";

import HorizontalStepper from "@/components/horizontalStepper";
import SelfQRcodeWrapper, { countries } from "@selfxyz/qrcode";
import { Button, Modal, ModalBody, ModalContent, ModalHeader, Spinner } from "@heroui/react";
import { SelfAppBuilder } from "@selfxyz/core";
import { useEffect, useState } from "react";
import type { Reward } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { siteConfig } from "@/config/site";
import { useAccount } from "wagmi";
import toast from "react-hot-toast";

function VerifyUberEmail({ onSuccess }: { onSuccess: (email: string) => void }) {
	
	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				if (e.target?.result) {
					const base64String = (e.target.result as string).split(',')[1];
					onSuccess(base64String);
				}
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div className="flex flex-col items-center gap-4">
			<input
				type="file"
				accept=".eml"
				onChange={handleFileUpload}
				className="hidden"
				id="uber-email-upload"
			/>
			<Button 
				color="primary"
				onPress={() => document.getElementById('uber-email-upload')?.click()}
			>
				Upload Uber E-Mail
			</Button>
		</div>
	)
}

function VerifyNFTHolding({ address, onSuccess }: { address: string, onSuccess: (address: string) => void }) {
	useEffect(() => {
		setTimeout(() => {
			onSuccess(address);
		}, 1000);
	}, [onSuccess]);

	return (
		<Spinner />
	)
}

function VerifySelfProtocol({ rewardId, country, onSuccess }: { rewardId: string, country: string, onSuccess: (userId: string) => void }) {
	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		setMounted(true);
	}, []);

	const userId = uuidv4();
	const selfApp = new SelfAppBuilder({
        appName: siteConfig.name,
        scope: "touchgrass",
        endpoint: `${process.env.NEXT_PUBLIC_API_URL}/api/verifyself?id=${rewardId}`,
        userId,
		disclosures: {
			// excludedCountries: [country],
			excludedCountries: ["FRA"]
		}
	}).build();

	if (!mounted) {
		return (<Spinner />);
	}

	return (
		<div className="bg-white rounded-2xl p-3 flex justify-center" onClick={() => onSuccess(userId)} onKeyDown={() => onSuccess(userId)}>
			<SelfQRcodeWrapper
				selfApp={selfApp}
				onSuccess={() => {
					onSuccess(userId);
				}}
				size={250}
			/>
		</div>
	)
}

interface RewardModalProps {
	isOpen: boolean;
	selectedItem: Reward;
	onOpenChange: (isOpen: boolean) => void;
}
export default function RewardModal({ isOpen, onOpenChange, selectedItem }: RewardModalProps) {
	const requirements = JSON.parse(selectedItem?.requirements || '[]');
	const steps = [...requirements.map((req: any) => req.type), "success"];
	const [currentStep, setCurrentStep] = useState(steps[0]);

	const [uberEmail, setUberEmail] = useState<string | null>(null);
	const [nftAddress, setNftAddress] = useState<string | null>(null);
	const [selfUserId, setSelfUserId] = useState<string | null>(null);

	const nftRequirement = requirements.find((req: any) => req.type === "nft");
	const selfRequirement = requirements.find((req: any) => req.type === "self");

	useEffect(() => {
		if (isOpen) {
			setCurrentStep(steps[0]);
		}
	}, [isOpen]);

	const { address } = useAccount();

	useEffect(() => {
		if (steps.length === 1) {
			return;
		}
		if (currentStep === steps[steps.length - 1]) {
			onOpenChange(false);
			try {
				fetch('/api/verify', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ rewardID: selectedItem.id, accountAddress: address, email: uberEmail, nft: nftAddress, userId: selfUserId }),
				}).then(() => {
					toast.success("Reward verified successfully");
				}).catch(error => {
					console.error(error);
					toast.error("Error verifying reward");
				});
			} catch (error) {
				console.error(error);
				toast.error("Error verifying reward");
			}
		}
	}, [currentStep]);

	const getTitleForStep = (step: string) => {
		if (step === "success") {
			return undefined;
		}
		const titles: Record<string, string> = {
			uber: "Verify Uber E-Mail",
			nft: "Verify NFT Holding",
			self: "Verify Self Protocol"
		};
		return titles[step] || `Verify ${step.charAt(0).toUpperCase() + step.slice(1)}`;
	};

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
			<ModalContent className="!h-[500px]">
				<ModalHeader className="flex flex-col items-center gap-1 pb-0">
					<HorizontalStepper
						className="w-full"
						currentStep={steps.indexOf(currentStep)}
						steps={steps
							.map((step: string) => ({
								title: getTitleForStep(step)
							}))
							.filter(step => step.title !== undefined)}
					/>
				</ModalHeader>

				<ModalBody className="h-full flex flex-col items-center justify-center pt-0">
					{currentStep === "uber" && <VerifyUberEmail onSuccess={(email) => {
						setUberEmail(email);
						setCurrentStep(steps[steps.indexOf(currentStep) + 1]);
					}} />}
					{currentStep === "nft" && <VerifyNFTHolding address={nftRequirement?.address} onSuccess={(address) => {
						setNftAddress(address);
						setCurrentStep(steps[steps.indexOf(currentStep) + 1]);
					}} />}
					{currentStep === "self" && <VerifySelfProtocol country={selfRequirement?.country} rewardId={selectedItem.id} onSuccess={(userId) => {
						setSelfUserId(userId);
						setCurrentStep(steps[steps.indexOf(currentStep) + 1]);
					}} />}
				</ModalBody>
			</ModalContent>
		</Modal>
    )
}
