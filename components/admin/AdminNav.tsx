"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export function AdminNav({ children }: { children: ReactNode }) {
  return (
    <nav className="flex flex-col fixed w-[300px] bg-color-pallet-02 h-full">
      {children}
    </nav>
  );
}

export function AdminNavLink({
  href,
  name,
  children,
}: {
  href: string;
  name: string;
  children?: ReactNode;
}) {
  const pathname = usePathname();
  const isActive =
    href === "/admin" ? pathname === href : pathname.startsWith(href);

  return (
    <div
      className={`flex flex-col ${
        isActive && "border-2 border-color-pallet-04"
      }`}
    >
      <Link
        href={href}
        className={`text-lg font-bold text-text-color-dark-green px-3 py-2 hover:bg-color-pallet-04 ${
          isActive && "bg-color-pallet-03"
        } ${pathname === href && "underline"}`}
      >
        {name}
        {children && <span>&#x2304;</span>}
      </Link>
      {isActive && children}
    </div>
  );
}

export function AdminNavSubLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  return (
    <Link
      href={href}
      className={`text-sm font-bold text-text-color-dark-green px-3 py-2 hover:bg-color-pallet-04
        ${pathname === href && "bg-color-pallet-03 underline"}`}
    >
      {children}
    </Link>
  );
}
