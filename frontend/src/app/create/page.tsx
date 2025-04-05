"use client";

import { DateInput, Input, Button, Select, SelectItem, NumberInput } from "@heroui/react";
import {parseDate} from "@internationalized/date";

export const animals = [
	{key: "nft", label: "NFT"},
	{key: "email", label: "E-Mail"},
	{key: "self", label: "Self Protocol"},
	{key: "wld", label: "WorldID"},
];

export default function Create() {
	return (
		<section className="h-full w-full z-20 flex flex-col items-center justify-start gap-4">
			<h1 className="text-2xl font-bold">Create Reward</h1>
			<div className="w-full flex flex-row gap-4">
				<Input placeholder="Reward Name" label="Reward Name" isRequired={true} />
				<Input placeholder="Reward Emoji" label="Reward Emoji" isRequired={true} />
			</div>
			<Input placeholder="Reward Description" label="Reward Description" isRequired={true} />
			<DateInput
				fullWidth={true}
				isRequired={true}
				label={"Birth date"}
				placeholderValue={parseDate(new Date().toISOString().split('T')[0])}
			/>
			<Select isRequired={true} label="Conditions" placeholder="Select conditions" selectionMode="multiple">
				{animals.map((animal) => (
					<SelectItem key={animal.key}>{animal.label}</SelectItem>
				))}
			</Select>
			<div className="w-full flex flex-row gap-4">
				<NumberInput isRequired={true} placeholder="Enter the reward amount" label="Reward Amount" />
				<NumberInput isRequired={true} placeholder="Enter the max reward times" label="Max Reward Times" />
			</div>
			<Button color="primary" fullWidth={true}>Create Reward</Button>
		</section>
	)
}
