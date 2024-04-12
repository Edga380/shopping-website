"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ComponentProps } from "react";

export default function NavBar(
  props: Omit<ComponentProps<typeof Link>, "className">
) {
  const pathname = usePathname();
  return (
    <>
      <nav className="bg-color-pallet-02 sticky flex justify-between items-center h-16">
        <Link className="mx-20" href="/">
          <Image
            src="/dodo_ir_sese_sm_text_logo.svg"
            width={100}
            height={60}
            alt="Brand logo"
            className="transition-transform duration-300 transform hover:scale-110"
          ></Image>
        </Link>
        <div className="justify-center">
          <Link
            {...props}
            className={`text-lg font-bold text-text-color-dark-green mr-10 px-3 py-2 rounded hover:bg-color-pallet-04 ${
              pathname === props.href && "underline"
            }`}
          >
            Home
          </Link>
          <Link
            {...props}
            className={`text-lg font-bold text-text-color-dark-green mr-10 px-3 py-2 rounded hover:bg-color-pallet-04 ${
              pathname === props.href && "underline"
            }`}
          >
            Products
          </Link>
        </div>
        <div className="justify-center flex">
          <Link className="mr-5" href="/">
            <Image
              src="/search_img.svg"
              width={30}
              height={30}
              alt="Brand logo"
              className="transition-transform duration-300 transform hover:scale-110"
            ></Image>
          </Link>
          <Link className="mr-5" href="/">
            <Image
              src="/user_img.svg"
              width={30}
              height={30}
              alt="Brand logo"
              className="transition-transform duration-300 transform hover:scale-110"
            ></Image>
          </Link>
          <Link className="mr-5" href="/">
            <Image
              src="/cart_img.svg"
              width={30}
              height={30}
              alt="Brand logo"
              className="transition-transform duration-300 transform hover:scale-110"
            ></Image>
          </Link>
        </div>
      </nav>
    </>
  );
}
