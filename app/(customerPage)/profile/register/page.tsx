"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { RegisterUser } from "../../../../database/models/user/register";

export default function Register() {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [confirmEmail, setConfirmEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>("");
  const [storeMessage, setStoreMessage] = useState<{
    message: string;
    color: string;
  }>({
    message: "",
    color: "",
  });
  const [passwordDifficultyEntries, setPasswordDifficultyEntries] = useState({
    uppercase: false,
    lowercase: false,
    number: false,
    symbol: false,
    length: false,
  });

  const passwordDifficultyBar = (baseNumber: number) => {
    const activeEntries = Object.values(passwordDifficultyEntries).filter(
      Boolean
    ).length;

    if (activeEntries < baseNumber) {
      return "red";
    }

    switch (activeEntries) {
      case 2:
        return "red";
      case 3:
        return "orange";
      case 4:
        return "yellow";
      case 5:
        return "green";
      default:
        return "red";
    }
  };

  useEffect(() => {
    setEmailErrorMessage(
      email !== confirmEmail && confirmEmail ? "Emails do not match." : ""
    );
  }, [email, confirmEmail]);

  useEffect(() => {
    setPasswordErrorMessage(
      password !== confirmPassword && confirmPassword
        ? "Passwords do not match"
        : ""
    );

    setPasswordDifficultyEntries({
      uppercase: /(?=.*[A-Z])/.test(password),
      lowercase: /(?=.*[a-z])/.test(password),
      number: /(?=.*[0-9])/.test(password),
      symbol: /(?=.*[!£$%&@#])/.test(password),
      length: password.length > 7 ? true : false,
    });
  }, [password, confirmPassword]);

  const handleChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleChangeConfirmEmail = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmEmail(event.target.value);
  };

  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleChangeConfirmPassword = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailErrorMessage("Email format incorrect.");
      return;
    }
    if (Object.values(passwordDifficultyEntries).filter(Boolean).length < 5) {
      setPasswordErrorMessage("Password is too weak.");
      return;
    }

    try {
      const response = await RegisterUser(username, email, password);

      if (response.success) {
        setStoreMessage({ message: response.message, color: "green" });
      } else {
        setStoreMessage({ message: response.message, color: "red" });
      }
    } catch (error) {
      console.error("Error: ", error);
      setStoreMessage({
        message: "Something unexpected happened, try again later.",
        color: "red",
      });
    }
  };

  return (
    <div className="bg-color-pallet-02 my-4 rounded-2xl flex justify-center">
      <div className="flex flex-col justify-center items-center">
        <div className="text-text-color-dark-green font-semibold text-3xl mt-14">
          Create account
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center"
        >
          <input
            type="text"
            placeholder="Username"
            minLength={4}
            maxLength={30}
            className="w-96 h-10 mt-8 p-2 rounded-md"
            onChange={handleChangeUsername}
            required
          ></input>
          {emailErrorMessage ? (
            <div className="text-red-600 font-semibold text-lg mt-2">
              {emailErrorMessage}
            </div>
          ) : (
            <div className="mt-7"></div>
          )}
          <input
            type="email"
            placeholder="Email"
            minLength={10}
            maxLength={30}
            className="w-96 h-10 mt-2 p-2 rounded-md"
            onChange={handleChangeEmail}
            required
          ></input>
          <input
            type="email"
            placeholder="Confirm Email"
            minLength={10}
            maxLength={30}
            className="w-96 h-10 mt-4 p-2 rounded-md"
            onChange={handleChangeConfirmEmail}
            required
          ></input>
          {passwordErrorMessage ? (
            <div className="text-red-600 font-semibold text-lg mt-2">
              {passwordErrorMessage}
            </div>
          ) : (
            <div className="mt-9"></div>
          )}
          <input
            type="password"
            placeholder="Password"
            minLength={8}
            maxLength={30}
            className="w-96 h-10 mt-2 p-2 rounded-md"
            onChange={handleChangePassword}
            required
          ></input>
          <input
            type="password"
            placeholder="Confirm Password"
            minLength={8}
            maxLength={30}
            className="w-96 h-10 mt-4 p-2 rounded-md"
            onChange={handleChangeConfirmPassword}
            required
          ></input>
          <div
            className={`px-2 mt-2`}
            style={{ color: passwordDifficultyBar(0) }}
          >
            Password
            {Object.values(passwordDifficultyEntries).filter(Boolean).length <=
            3
              ? " weak"
              : Object.values(passwordDifficultyEntries).filter(Boolean)
                  .length === 4
              ? " average"
              : " strong"}
          </div>
          <div className="flex flex-row space-x-1">
            {[2, 3, 4, 5].map((baseNumber: number) => (
              <div
                key={baseNumber}
                className={`w-20 h-2 my-2 rounded-full`}
                style={{
                  backgroundColor: passwordDifficultyBar(baseNumber),
                }}
              ></div>
            ))}
          </div>
          <div className="text-text-color-dark-green font-semibold mt-4 flex flex-wrap w-[30rem]">
            <span className="font-bold ml-1">Password</span>, must include at
            least
            <span className="font-bold ml-1">8 characters</span>, including an
            <span className="font-bold ml-1">uppercase letter</span>,
            <span className="font-bold ml-1">lowercase letter</span> ,
            <span className="font-bold mx-1">number</span> and
            <span className="font-bold ml-1">symbol</span>.
          </div>
          {storeMessage.message ? (
            <div
              className="font-semibold text-lg"
              style={{ color: storeMessage.color }}
            >
              {storeMessage.message}
            </div>
          ) : (
            <div className="mt-7"></div>
          )}
          <button
            type="submit"
            className="bg-color-pallet-03 py-2 px-6 mt-2 mb-2 rounded-md hover:bg-color-pallet-04 shadow-md text-text-color-dark-green font-semibold text-xl"
          >
            Confirm
          </button>
        </form>
        <div className="mt-4 mb-20">
          <Link
            href={"/profile"}
            className="bg-color-pallet-03 py-2 px-6 rounded-md hover:bg-color-pallet-04 shadow-md text-text-color-dark-green font-semibold text-xl"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}
