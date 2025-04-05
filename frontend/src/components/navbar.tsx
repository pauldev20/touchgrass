"use client";

import { siteConfig } from "@/config/site";
import {
    Button,
    Link,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle,
} from "@heroui/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

import logo from "../app/icon.png";
import ConnectWallet from "./connectWallet";

const menuItems = [
    {
        label: "Home",
        href: "/",
    },
    {
        label: "Rewards",
        href: "/rewards",
    },
];

function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
    const currentPath = usePathname();

    return (
        <NavbarItem isActive={currentPath === href}>
            <Link
                color={currentPath === href ? "primary" : "foreground"}
                aria-current={currentPath === href ? "page" : undefined}
                href={href}
            >
                {children}
            </Link>
        </NavbarItem>
    );
}

function MenuItem({ label, href }: { label: string; href: string }) {
    const currentPath = usePathname();

    return (
        <NavbarMenuItem>
            <Link className="w-full" color={currentPath === href ? "primary" : "foreground"} href={href} size="lg">
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
                <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} className="sm:hidden" />
                <NavbarBrand className="flex items-center gap-2">
                    <Image src={logo} alt="logo" width={27} height={27} />
                    <p className="font-bold text-xl text-inherit">{siteConfig.name}</p>
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
                    <ConnectWallet />
                </NavbarItem>
            </NavbarContent>

            <NavbarMenu>
                {menuItems.map((item, index) => (
                    <MenuItem key={`${item.label}-${index}`} label={item.label} href={item.href} />
                ))}
            </NavbarMenu>
        </Navbar>
    );
}
