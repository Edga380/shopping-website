"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { ComponentProps, ReactNode } from "react";

export default function NavBar({ children }: { children: ReactNode }) {
  return (
    <nav className="bg-color-pallet-02 sticky flex justify-between items-center h-16 w-screen">
      {children}
    </nav>
  );
}

export function NavLink(props: Omit<ComponentProps<typeof Link>, "classname">) {
  const pathname = usePathname();
  return (
    <Link
      {...props}
      className={`text-lg font-bold text-text-color-dark-green mr-10 px-3 py-2 rounded hover:bg-color-pallet-04 ${
        pathname === props.href && "underline"
      }`}
    ></Link>
  );
}

export function NavLinkLogo(
  props: Omit<ComponentProps<typeof Link>, "classname">
) {
  return (
    <Link {...props}>
      <Image
        src="/dodo_ir_sese_sm_text_logo.svg"
        width={100}
        height={60}
        alt="Brand logo"
        className="transition-transform duration-300 transform hover:scale-110 mx-6"
      ></Image>
    </Link>
  );
}

interface NavLinkImageButtonProps {
  href: string;
  imagePath: string;
  width: number;
  height: number;
  alt: string;
}

export function NavLinkImageButton(props: NavLinkImageButtonProps) {
  const { href, imagePath, width, height, alt } = props;
  return (
    <Link className="mr-5" href={href}>
      <Image
        src={imagePath}
        width={width}
        height={height}
        alt={alt}
        className="transition-transform duration-300 transform hover:scale-110"
      ></Image>
    </Link>
  );
}
