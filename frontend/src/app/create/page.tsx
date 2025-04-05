"use client";

import { DateInput, Input, Button } from "@heroui/react";
import {parseDate} from "@internationalized/date";


export default function Create() {
	return (
		<section className="h-full w-full z-20 flex flex-col items-center justify-start gap-4">
			<h1 className="text-2xl font-bold">Create Reward</h1>
			<div className="w-full flex flex-row gap-4">
				<Input placeholder="Reward Name" label="Reward Name" />
				<Input placeholder="Reward Description" label="Reward Description" />
			</div>
			<DateInput
				fullWidth={true}
				label={"Birth date"}
				placeholderValue={parseDate(new Date().toISOString().split('T')[0])}
			/>
			<Button color="primary" fullWidth={true}>Create Reward</Button>
		</section>
	)
}
