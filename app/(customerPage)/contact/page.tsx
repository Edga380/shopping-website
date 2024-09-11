"use client";

import React, { useState } from "react";
import addSubmission from "../../../database/models/contact/addSubmission";

export default function Contact() {
  const [messageData, setMessageData] = useState<{
    message: string;
    color: string;
  }>({ message: "", color: "" });

  const handleSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append(
      "fullname",
      (event.currentTarget.querySelector("#fullname") as HTMLInputElement).value
    );
    formData.append(
      "email",
      (event.currentTarget.querySelector("#email") as HTMLInputElement).value
    );
    formData.append(
      "subject",
      (event.currentTarget.querySelector("#subject") as HTMLInputElement).value
    );
    formData.append(
      "message",
      (event.currentTarget.querySelector("#message") as HTMLInputElement).value
    );

    try {
      const response = await addSubmission(formData);

      if (response.success) {
        setMessageData({ message: response.message, color: response.color });
      } else {
        setMessageData({ message: response.message, color: response.color });
      }
    } catch (error) {
      console.error("Failed to submit contact form.", error);
    }
  };

  return (
    <div className="flex flex-col bg-color-pallet-02 my-6 mx-auto w-2/6 rounded-lg">
      <h1 className="text-2xl font-semibold text-text-color-dark-green mt-10 mx-12">
        Contact form
      </h1>
      {messageData.message ? (
        <a
          className="text-md text-center font-semibold text-text-color-dark-green m-3"
          style={{ color: `${messageData.color}` }}
        >
          {messageData.message}
        </a>
      ) : (
        <a className="m-6"></a>
      )}
      <div className="m-auto w-10/12 bg-color-pallet-03 p-4 rounded-lg shadow-lg mb-12">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col text-text-color-dark-green font-semibold"
        >
          <p className="font-normal text-sm mb-2">
            Fields with <span className="text-red-600">*</span> required.
          </p>
          <label htmlFor="fullname">
            Full name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="fullname"
            name="fullname"
            maxLength={40}
            required
            className="mb-4 h-9 pl-2 rounded shadow-lg"
          />
          <label htmlFor="email">
            Email <span className="text-red-600">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            maxLength={40}
            required
            className="mb-4 h-9 pl-2 rounded shadow-lg"
          />
          <label htmlFor="subject">
            Subject <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            maxLength={40}
            required
            className="mb-4 h-9 pl-2 rounded shadow-lg"
          />
          <label htmlFor="message">
            Message <span className="text-red-600">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            maxLength={400}
            required
            className="mb-4 h-32 p-2 rounded shadow-lg"
          />
          <button className="text-xl bg-color-pallet-02 hover:bg-color-pallet-04 rounded shadow-lg py-2">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
