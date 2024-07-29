"use client";

import React, { ChangeEvent, useRef, useState } from "react";

export default function Contact() {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    if (selectedFiles.length > 4 || files.length >= 4) {
      alert("You can only select up to 4 files.");
      event.target.value = "";
    } else {
      setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    }
  };

  const handleRemoveFile = (id: number) => {
    const newFiles = files.filter((_, index) => index !== id);
    setFiles(newFiles);

    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      newFiles.forEach((file) => dataTransfer.items.add(file));
      fileInputRef.current.files = dataTransfer.files;
    }
  };

  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
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

    formData.append("imageCount", files.length.toString());

    files.forEach((image, i) => {
      formData.append(`image_${i}`, image);
    });

    console.log(Object.fromEntries(formData.entries()));
  };

  return (
    <div className="flex flex-col bg-color-pallet-02 my-6 mx-auto w-2/6 rounded-lg">
      <h1 className="text-2xl font-semibold text-text-color-dark-green m-10">
        Contact form
      </h1>
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
            className="mb-4 h-32 pl-2 rounded shadow-lg"
          />
          <label className="flex flex-col items-center mb-4 bg-white text-text-color-dark-green rounded shadow-lg uppercase cursor-pointer hover:bg-color-pallet-04">
            <span className="flex items-center align-middle h-10">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="#161616"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M13.75 5.62496V14.4416C13.75 16.1833 12.475 17.7333 10.7416 17.9C8.74998 18.0916 7.08331 16.5333 7.08331 14.5833V4.28329C7.08331 3.19163 7.86665 2.19996 8.94998 2.09163C10.2 1.96663 11.25 2.94163 11.25 4.16663V12.9166C11.25 13.375 10.875 13.75 10.4166 13.75C9.95831 13.75 9.58331 13.375 9.58331 12.9166V5.62496C9.58331 5.28329 9.29998 4.99996 8.95831 4.99996C8.61665 4.99996 8.33331 5.28329 8.33331 5.62496V12.8C8.33331 13.8916 9.11665 14.8833 10.2 14.9916C11.45 15.1166 12.5 14.1416 12.5 12.9166V4.30829C12.5 2.56663 11.225 1.01663 9.49165 0.849959C7.50831 0.658292 5.83331 2.21663 5.83331 4.16663V14.3916C5.83331 16.7833 7.58331 18.925 9.96665 19.15C12.7083 19.4 15 17.2666 15 14.5833V5.62496C15 5.28329 14.7166 4.99996 14.375 4.99996C14.0333 4.99996 13.75 5.28329 13.75 5.62496Z"></path>
              </svg>
              Attach files
            </span>
            <input
              type="file"
              className="hidden"
              multiple
              onChange={handleFileChange}
              ref={fileInputRef}
            />
          </label>
          {files.length > 0 && (
            <div className="mb-4">
              <p className="text-sm">Selected files:</p>
              <ul className="list-disc pl-5">
                {files.map((file, index) => (
                  <li key={index} className="text-sm">
                    {file.name}
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700 ml-2"
                      onClick={() => handleRemoveFile(index)}
                    >
                      x
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button className="text-xl bg-color-pallet-02 hover:bg-color-pallet-04 rounded shadow-lg py-2">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
