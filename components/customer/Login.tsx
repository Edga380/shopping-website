"use client";

import Link from "next/link";
import { useState } from "react";
import RecoverPassword from "./RecoverPassword";

export default function Login() {
  const [recoverIsActive, setRecoverIsActive] = useState<boolean>(false);

  const handleRecoverIsActive = () => {
    setRecoverIsActive(!recoverIsActive);
  };

  return (
    <>
      {!recoverIsActive ? (
        <div className="flex flex-col justify-center items-center">
          <div className="text-text-color-dark-green font-semibold text-3xl mt-32">
            Login
          </div>
          <form action="" className="flex flex-col justify-center items-center">
            <input
              type="email"
              placeholder="Email"
              className="w-96 h-10 mt-4 p-2 rounded-md"
            ></input>
            <input
              type="password"
              placeholder="Password"
              className="w-96 h-10 mt-4 p-2 rounded-md"
            ></input>
            <button
              onClick={() => handleRecoverIsActive()}
              className="text-text-color-dark-green underline hover:bg-color-pallet-04 rounded-md mt-2 p-1 self-start"
            >
              Forgot password?
            </button>
            <button
              type="submit"
              className="bg-color-pallet-03 py-2 px-6 mt-8 mb-2 rounded-md hover:bg-color-pallet-04 shadow-md text-text-color-dark-green font-semibold text-xl"
            >
              Sign in
            </button>
          </form>
          <Link
            href={"/"}
            className="text-text-color-dark-green underline hover:bg-color-pallet-04 rounded-md mt-2 p-1 mb-32"
          >
            Create account
          </Link>
        </div>
      ) : (
        <RecoverPassword handleRecoverIsActive={handleRecoverIsActive} />
      )}
    </>
  );
}
