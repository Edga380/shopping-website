"use client";

import { useState } from "react";
import subscribeNewsLetter from "../../database/models/user/subscribeNewsLetter";

export default function NewsLetterForm() {
  const [email, setEmail] = useState<string>("");
  const [messageData, setMessageData] = useState<{
    message: string;
    color: string;
  }>({ message: "", color: "" });

  const handleFormSubmit = async () => {
    const response = await subscribeNewsLetter(email);

    if (response.success) {
      setMessageData({ message: response.message, color: response.color });
      setEmail("");
    } else {
      setMessageData({ message: response.message, color: response.color });
    }
  };

  return (
    <div className="flex flex-col p-6">
      <div className="text-2xl text-text-color-dark-green font-semibold self-center mb-3">
        SUBSCRIBE TO OUR NEWSLETTER
      </div>
      <div className="relative self-center w-3/5">
        <input
          className="w-full h-10 pl-2"
          type="email"
          id="email"
          placeholder="Email"
          maxLength={50}
          onChange={(event) => setEmail(event.currentTarget.value)}
          required
        />
        <button
          onClick={handleFormSubmit}
          className="absolute right-0 mr-2 text-2xl"
        >
          &rarr;
        </button>
      </div>
      <div
        className="font-semibold mx-auto mt-2 text-sm"
        style={{ color: `${messageData.color}` }}
      >
        {messageData.message}
      </div>
    </div>
  );
}
