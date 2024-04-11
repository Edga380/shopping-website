"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps, ReactNode } from "react";

export function AdminNav({ children }: { children: ReactNode }) {
  return <nav className="">{children}</nav>;
}

export function NavLink(props: Omit<ComponentProps<typeof Link>, "className">) {
  const pathname = usePathname();
  return (
    <Link
      {...props}
      className={`p-4 hover:bg-slate-600 hover:text-slate-900 focus-visible:bg-slate-600 focus-visible:text-slate-900 ${
        pathname === props.href && "bg-slate-300 text-slate-900"
      }`}
    ></Link>
  );
}
