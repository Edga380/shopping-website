"use client";

import { useState, useEffect } from "react";
import recoverPassword from "../../../database/models/user/recoverPassword";
import { useSearchParams } from "next/navigation";
import resetPassword from "../../../database/models/user/resetPassword";

export default function DisplayResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const [messageData, setMessageData] = useState<{
    message: string;
    color: string;
  }>({ message: "", color: "" });
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
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
    setPasswordErrorMessage(
      newPassword !== confirmNewPassword && confirmNewPassword
        ? "Passwords do not match"
        : ""
    );

    setPasswordDifficultyEntries({
      uppercase: /(?=.*[A-Z])/.test(newPassword),
      lowercase: /(?=.*[a-z])/.test(newPassword),
      number: /(?=.*[0-9])/.test(newPassword),
      symbol: /(?=.*[!£$%&@#])/.test(newPassword),
      length: newPassword.length > 7 ? true : false,
    });
  }, [newPassword, confirmNewPassword]);

  const submitResetPasswordForm = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      if (!email || !token) {
        setMessageData({
          message: "Email and token not found.",
          color: "red",
        });
        return;
      }

      const response = await resetPassword(email, newPassword, token);

      if (response.success) {
        setMessageData({ message: response.message, color: response.color });
      } else {
        setMessageData({ message: response.message, color: response.color });
      }
    } catch (error) {
      throw error;
    }
  };
  return (
    <form
      onSubmit={submitResetPasswordForm}
      className="flex flex-col justify-center items-center"
    >
      {messageData.message ? (
        <div
          className="mt-2 font-semibold"
          style={{ color: `${messageData.color}` }}
        >
          {messageData.message}
        </div>
      ) : (
        <div className="mt-8"></div>
      )}
      {passwordErrorMessage ? (
        <div className="text-red-600 font-semibold text-lg mt-2">
          {passwordErrorMessage}
        </div>
      ) : (
        <div className="mt-9"></div>
      )}
      <input
        type="password"
        placeholder="New password"
        value={newPassword}
        minLength={8}
        maxLength={30}
        className="w-96 h-10 mt-2 p-2 rounded-md"
        onChange={(event) => setNewPassword(event.target.value)}
        required
      ></input>
      <input
        type="password"
        placeholder="Confirm new password"
        value={confirmNewPassword}
        minLength={8}
        maxLength={30}
        className="w-96 h-10 mt-4 p-2 rounded-md"
        onChange={(event) => setConfirmNewPassword(event.target.value)}
        required
      ></input>
      <div className={`px-2 mt-2`} style={{ color: passwordDifficultyBar(0) }}>
        Password
        {Object.values(passwordDifficultyEntries).filter(Boolean).length <= 3
          ? " weak"
          : Object.values(passwordDifficultyEntries).filter(Boolean).length ===
            4
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
        <span className="font-bold ml-1">Password</span>, must include at least
        <span className="font-bold ml-1">8 characters</span>, including an
        <span className="font-bold ml-1">uppercase letter</span>,
        <span className="font-bold ml-1">lowercase letter</span> ,
        <span className="font-bold mx-1">number</span> and
        <span className="font-bold ml-1">symbol</span>.
      </div>
      <button
        type="submit"
        className="bg-color-pallet-03 py-2 px-6 mt-4 mb-20 rounded-md hover:bg-color-pallet-04 shadow-md text-text-color-dark-green font-semibold text-xl"
      >
        Submit
      </button>
    </form>
  );
}
