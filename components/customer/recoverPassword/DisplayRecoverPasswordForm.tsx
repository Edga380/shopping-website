"use client";

import { useState } from "react";
import recoverPassword from "../../../database/models/user/recoverPassword";

export default function DisplayRecoverPasswordForm() {
  const [messageData, setMessageData] = useState<{
    message: string;
    color: string;
  }>({ message: "", color: "" });

  const submitPasswordRecoveryForm = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const formData = new FormData();

    formData.append(
      "email",
      (event.currentTarget.querySelector("#email") as HTMLInputElement).value
    );

    try {
      const response = await recoverPassword(formData);

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
      onSubmit={submitPasswordRecoveryForm}
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
      <input
        id="email"
        type="email"
        name="email"
        placeholder="Input email"
        className="w-96 h-10 mt-2 p-2 rounded-md"
        required
      ></input>
      <button
        type="submit"
        className="bg-color-pallet-03 py-2 px-6 mt-8 rounded-md hover:bg-color-pallet-04 shadow-md text-text-color-dark-green font-semibold text-xl"
      >
        Submit
      </button>
    </form>
  );
}
