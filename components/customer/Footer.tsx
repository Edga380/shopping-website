"use client";

import Link from "next/link";
import NewsLetterForm from "./NewsLetterForm";

export default function Footer() {
  return (
    <div className="grid grid-cols-2 bg-color-pallet-02 px-4">
      <NewsLetterForm />
      <div className="flex flex-col">
        <div className="grid grid-cols-2">
          <div className="text-text-color-dark-green font-semibold text-xl mx-auto my-3 flex flex-col">
            Info
            <Link
              href={"/terms-and-conditions"}
              className="text-base hover:underline"
            >
              Terms and conditions
            </Link>
            <Link
              href={"/privacy-policy"}
              className="text-base hover:underline"
            >
              Privacy policy
            </Link>
          </div>
          <div className="text-text-color-dark-green font-semibold text-xl mx-auto my-3 flex flex-col">
            Support
            <Link href={"/contact"} className="text-base hover:underline">
              Contact us
            </Link>
          </div>
        </div>
        <div className="text-text-color-dark-green font-semibold text-xl mx-auto my-3 self-center">
          &copy; DoDo ir SeSe {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}
