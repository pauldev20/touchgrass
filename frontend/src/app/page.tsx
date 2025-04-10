"use client";

import { siteConfig } from "@/config/site";
import { Button } from "@heroui/react";

export default function Home() {
    return (
        <section className="h-full z-20 flex flex-col items-center justify-center gap-[18px] sm:gap-6">
            {/* <Button
                className="h-9 overflow-hidden border-1 border-default-100 bg-default-50 px-[18px] py-2 text-small font-normal leading-5 text-default-500"
                radius="full"
                variant="bordered"
            </Button> */}
            <div className="text-center text-[clamp(40px,10vw,44px)] font-bold leading-[1.2] tracking-tighter sm:text-[64px]">
                <div className="bg-hero-section-title bg-clip-text text-transparent">
                    Simply reimburse <br /> your members onchain.
                </div>
            </div>
            <p className="text-center font-normal leading-7 text-default-500 sm:w-[466px] sm:text-[18px]">
                {siteConfig.description}
            </p>
            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
                {/* <Button
                    className="h-10 bg-default-foreground px-[16px] py-[10px] text-small font-medium leading-5 text-background"
                    radius="full"
					href="/rewards"
                >
                    Expense reimbursements made simple
                </Button> */}
                {/* <Button
                    className="h-10 w-[163px] border-1 border-default-100 px-[16px] py-[10px] text-small font-medium leading-5"
                    radius="full"
                    variant="bordered"
					href="/rewards"
                >
                    About TouchGrass
                </Button> */}
            </div>
        </section>
    );
}
