"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps, ReactNode } from "react";

export function AdminNav({ children }: { children: ReactNode }) {
  return <nav className="my-4">{children}</nav>;
}

export function AdminNavLink(
  props: Omit<ComponentProps<typeof Link>, "className">
) {
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
