"use client";

import HorizontalStepper from "@/components/horizontalStepper";
import SelfQRcodeWrapper, { countries } from "@selfxyz/qrcode";
import { Button, Modal, ModalBody, ModalContent, ModalHeader, Spinner } from "@heroui/react";
import { SelfAppBuilder } from "@selfxyz/core";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

function VerifyUberEmail({ onSuccess }: { onSuccess: () => void }) {
	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			// TODO: Handle the file upload to your backend
			console.log('File selected:', file);
			onSuccess();
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

function VerifyNFTHolding({ onSuccess }: { onSuccess: () => void }) {
	useEffect(() => {
		setTimeout(() => {
			onSuccess();
		}, 1000);
	}, [onSuccess]);

	return (
		<Spinner />
	)
}

function VerifySelfProtocol({ onSuccess }: { onSuccess: () => void }) {
	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		setMounted(true);
	}, []);

	const userId = uuidv4();
	const selfApp = new SelfAppBuilder({
        appName: "Touchgrass",
        scope: "touchgrass",
        endpoint: `${process.env.NEXT_PUBLIC_API_URL}/api/verifyself/`,
        userId,
		disclosures: {
			minimumAge: 20,
			ofac: true,
			excludedCountries: [countries.FRANCE],
			name: true,
		}
	}).build();

	if (!mounted) {
		return (<Spinner />);
	}

	return (
		<div className="bg-white rounded-2xl p-3 flex justify-center" onClick={onSuccess} onKeyDown={onSuccess}>
			<SelfQRcodeWrapper
				selfApp={selfApp}
				onSuccess={onSuccess}
				size={250}
			/>
		</div>
	)
}

interface RewardModalProps {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
}
export default function RewardModal({ isOpen, onOpenChange }: RewardModalProps) {
	const steps = [
		"uber-email",
		"nft-holding",
		"self-protocol",
		"success"
	];
	const [currentStep, setCurrentStep] = useState(steps[0]);

	useEffect(() => {
		if (currentStep === steps[steps.length - 1]) {
			onOpenChange(false);
		}
	}, [currentStep]);

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
			<ModalContent className="!h-[500px]">
				<ModalHeader className="flex flex-col items-center gap-1 pb-0">
					<HorizontalStepper
						className="w-full"
						currentStep={steps.indexOf(currentStep)}
						steps={[
							{title: "Verify Uber E-Mail"},
							{title: "Verify NFT Holding"},
							{title: "Verify Self Protocol"}
						]}
					/>
				</ModalHeader>

				<ModalBody className="h-full flex flex-col items-center justify-center pt-0">
					{currentStep === "uber-email" && <VerifyUberEmail onSuccess={() => setCurrentStep(steps[steps.indexOf(currentStep) + 1])} />}
					{currentStep === "nft-holding" && <VerifyNFTHolding onSuccess={() => setCurrentStep(steps[steps.indexOf(currentStep) + 1])} />}
					{currentStep === "self-protocol" && <VerifySelfProtocol onSuccess={() => setCurrentStep(steps[steps.indexOf(currentStep) + 1])} />}
				</ModalBody>
			</ModalContent>
		</Modal>
    )
}
