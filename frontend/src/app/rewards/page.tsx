import Rewards from "./rewards";
import prisma from "@/lib/db";

export default async function RewardsWrapper() {
	const rewards = await prisma.reward.findMany();

    return (
        <Rewards rewards={rewards} />
    );
}
