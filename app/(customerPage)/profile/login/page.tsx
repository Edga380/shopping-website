"use client";

import Link from "next/link";
import { useState } from "react";
import loginUser from "../../../../database/models/user/loginUser";
import { useUser } from "../../../../context/UserContext";
import { useRouter } from "next/navigation";

export default function Login() {
  const { userData, setUserData } = useUser();
  const router = useRouter();
  const [userInputData, setUserInputData] = useState<{
    email: string;
    password: string;
    rememberMe: boolean;
  }>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await loginUser(userInputData);

      if (response.success) {
        setUserInputData({ email: "", password: "", rememberMe: false });
        if (response.data) {
          setUserData(response.data);
          router.push("/profile");
        }
      } else {
        setMessage(response.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-color-pallet-02 my-4 rounded-2xl flex justify-center">
      <div className="flex flex-col justify-center items-center">
        <div className="text-text-color-dark-green font-semibold text-3xl mt-32">
          Login
        </div>
        {message ? (
          <div className="text-red-600 font-semibold text-lg mt-2">
            {message}
          </div>
        ) : (
          <div className="mt-7"></div>
        )}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center"
        >
          <input
            type="email"
            placeholder="Email"
            value={userInputData.email}
            minLength={10}
            maxLength={30}
            className="w-96 h-10 mt-4 p-2 rounded-md"
            onChange={(event) =>
              setUserInputData({ ...userInputData, email: event.target.value })
            }
            required
          ></input>
          <input
            type="password"
            placeholder="Password"
            value={userInputData.password}
            minLength={8}
            maxLength={30}
            className="w-96 h-10 mt-4 p-2 rounded-md"
            onChange={(event) =>
              setUserInputData({
                ...userInputData,
                password: event.target.value,
              })
            }
            required
          ></input>
          <div className="mt-2 w-full flex">
            <input
              type="checkbox"
              name="Remember me"
              id="Remember me"
              onChange={() =>
                setUserInputData({
                  ...userInputData,
                  rememberMe: !userInputData.rememberMe,
                })
              }
              className="w-4 h-4 mt-4 mr-1"
            />
            <div className="text-text-color-dark-green underline mt-2 p-1 self-start">
              Remember me
            </div>
            <Link
              href={"/profile/recoverPassword"}
              className="text-text-color-dark-green underline hover:bg-color-pallet-04 rounded-md mt-2 p-1 ml-auto"
            >
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            className="bg-color-pallet-03 py-2 px-6 mt-8 mb-2 rounded-md hover:bg-color-pallet-04 shadow-md text-text-color-dark-green font-semibold text-xl"
          >
            Sign in
          </button>
        </form>
        <Link
          href={"/profile/register"}
          className="text-text-color-dark-green underline hover:bg-color-pallet-04 rounded-md mt-2 p-1 mb-32"
        >
          Create account
        </Link>
      </div>
    </div>
  );
}
