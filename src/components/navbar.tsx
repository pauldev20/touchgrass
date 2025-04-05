"use client";

import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@heroui/react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { useState } from "react";

const menuItems = [
	{
		label: "Home",
		href: "/",
	},
	{
		label: "Rewards",
		href: "/rewards",
	}
];


function NavItem({ href, children }: { href: string, children: React.ReactNode }) {
	const currentPath = usePathname();

	return (
		<NavbarItem isActive={currentPath === href}>
			<Link color={currentPath === href ? "primary" : "foreground"} aria-current={currentPath === href ? "page" : undefined} href={href}>
				{children}
			</Link>
		</NavbarItem>
	);
}

function MenuItem({ label, href }: { label: string, href: string }) {
	const currentPath = usePathname();

	return (
		<NavbarMenuItem>
			<Link
				className="w-full"
				color={currentPath === href ? "primary" : "foreground"}
				href={href}
				size="lg"
			>
				{label}
			</Link>
		</NavbarMenuItem>
	);
}

export default function CustomNavbar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<Navbar onMenuOpenChange={setIsMenuOpen}>
			<NavbarContent>
				<NavbarMenuToggle
					aria-label={isMenuOpen ? "Close menu" : "Open menu"}
					className="sm:hidden"
				/>
				<NavbarBrand>
					<p className="font-bold text-inherit">{siteConfig.name}</p>
				</NavbarBrand>
			</NavbarContent>

			<NavbarContent className="hidden sm:flex gap-4" justify="center">
				{menuItems.map((item) => (
					<NavItem key={item.label} href={item.href}>
						{item.label}
					</NavItem>
				))}
			</NavbarContent>
			<NavbarContent justify="end">
				<NavbarItem>
					<Button as={Link} color="primary" href="#" variant="flat">
						Connect Wallet
					</Button>
				</NavbarItem>
			</NavbarContent>

			<NavbarMenu>
				{menuItems.map((item, index) => (
					<MenuItem key={`${item.label}-${index}`} label={item.label} href={item.href} />
				))}
			</NavbarMenu>
		</Navbar>
	)
}
