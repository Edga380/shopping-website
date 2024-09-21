"use client";

import { useEffect, useState } from "react";
import sendNewsLetter from "../../../database/models/user/sendNewsLetter";
import {
  NewsLetterSection,
  NewsLetterEmailsData,
} from "../../../types/databaseTypes";
import Link from "next/link";

export default function NewsLetterForm({
  emailsData,
}: {
  emailsData: NewsLetterEmailsData[] | undefined;
}) {
  const [emails, setEmails] = useState<NewsLetterEmailsData[] | undefined>([]);
  const [sections, setSections] = useState<NewsLetterSection[]>([
    { title: "", imageUrl: "", message: "", buttonLink: "", buttonName: "" },
  ]);
  const [subject, setSubject] = useState<string>("");
  const [previewIsActive, setPreviewIsActive] = useState<boolean>(false);
  const [messageData, setMessage] = useState<{
    success: boolean;
    message: string;
    color: string;
  }>({ success: false, message: "", color: "" });

  useEffect(() => {
    setEmails(emailsData);
  }, []);

  const handleAddSection = () => {
    setSections([
      ...sections,
      { title: "", imageUrl: "", message: "", buttonLink: "", buttonName: "" },
    ]);
  };

  const handleRemoveSection = (indexToRemove: number) => {
    const updatedSections = sections.filter(
      (_, index) => index !== indexToRemove
    );
    setSections(updatedSections);
  };

  const handleSubmitNewsLetter = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const response = await sendNewsLetter(emails, subject, sections);

    if (response.success) {
      setMessage({
        success: response.success,
        message: response.message,
        color: response.color,
      });
    } else {
      setMessage({
        success: response.success,
        message: response.message,
        color: response.color,
      });
    }
  };

  return !previewIsActive ? (
    <form onSubmit={handleSubmitNewsLetter} className="flex flex-col ">
      <div className="text-text-color-dark-green font-semibold pl-3">
        Total emails: {emails?.length}
        <Link
          href="newsLetter/removeEmail"
          className="bg-color-pallet-03 ml-4 py-2 px-6 mx-auto mt-4 mb-2 rounded-md hover:bg-color-pallet-04 shadow-md text-text-color-dark-green font-semibold text-medium"
        >
          Remove email
        </Link>
      </div>
      <div className="mx-auto">
        <button
          type="button"
          onClick={() => handleAddSection()}
          className="bg-color-pallet-03 mr-4 py-2 px-6 mx-auto mt-4 mb-2 rounded-md hover:bg-color-pallet-04 shadow-md text-text-color-dark-green font-semibold text-xl"
        >
          Add section
        </button>
        <input
          type="text"
          placeholder="Subject"
          defaultValue={subject}
          onChange={(event) => setSubject(event.currentTarget.value)}
          className="rounded-lg border-2 border-color-pallet-04 p-2 mb-2 mx-auto"
          required
        />
        <button
          type="button"
          onClick={() => setPreviewIsActive(!previewIsActive)}
          className="bg-color-pallet-03 ml-4 py-2 px-6 mx-auto mt-4 mb-2 rounded-md hover:bg-color-pallet-04 shadow-md text-text-color-dark-green font-semibold text-xl"
        >
          Preview
        </button>
      </div>

      {sections.map((section, index) => (
        <div key={index} className="flex flex-col">
          <div className="flex mt-2 px-3">
            <div className="font-semibold text-2xl">Section {index + 1}</div>
            {index !== 0 && (
              <button
                type="button"
                onClick={() => handleRemoveSection(index)}
                className="bg-color-pallet-03 py-2 px-6 ml-auto mb-2 rounded-md hover:bg-color-pallet-04 shadow-md text-text-color-dark-green font-semibold text-xl"
              >
                X
              </button>
            )}
          </div>

          <input
            type="text"
            placeholder="Image url"
            defaultValue={section.imageUrl}
            onChange={(event) =>
              setSections(
                sections.map((section, imageIndex) =>
                  imageIndex === index
                    ? { ...section, imageUrl: event.currentTarget.value }
                    : section
                )
              )
            }
            className="rounded-lg border-2 border-color-pallet-04 p-2 mb-2 mx-2"
          />

          <input
            type="text"
            placeholder="Title"
            defaultValue={section.title}
            onChange={(event) =>
              setSections(
                sections.map((section, titleIndex) =>
                  titleIndex === index
                    ? { ...section, title: event.currentTarget.value }
                    : section
                )
              )
            }
            className="rounded-lg border-2 border-color-pallet-04 p-2 mb-2 mx-2"
          />
          <textarea
            key={index}
            name="message"
            id="message"
            placeholder="Message"
            defaultValue={section.message}
            onChange={(event) =>
              setSections(
                sections.map((section, messageIndex) =>
                  messageIndex === index
                    ? { ...section, message: event.currentTarget.value }
                    : section
                )
              )
            }
            className="rounded-lg border-2 border-color-pallet-04 p-2 mb-2 mx-2 h-96"
          />

          <input
            type="text"
            placeholder="Button link"
            defaultValue={section.buttonLink}
            onChange={(event) =>
              setSections(
                sections.map((section, buttonLinkIndex) =>
                  buttonLinkIndex === index
                    ? { ...section, buttonLink: event.currentTarget.value }
                    : section
                )
              )
            }
            className="rounded-lg border-2 border-color-pallet-04 p-2 mb-2 mx-2"
          />

          <input
            type="text"
            placeholder="Button name"
            defaultValue={section.buttonName}
            onChange={(event) =>
              setSections(
                sections.map((section, buttonNameIndex) =>
                  buttonNameIndex === index
                    ? { ...section, buttonName: event.currentTarget.value }
                    : section
                )
              )
            }
            className="rounded-lg border-2 border-color-pallet-04 p-2 mb-2 mx-2"
          />
        </div>
      ))}
      {messageData.message ? (
        <div className="">{messageData.message}</div>
      ) : (
        <div className="mt-6"></div>
      )}
      <button
        type="submit"
        className="bg-color-pallet-03 py-2 px-6 mx-auto mt-4 mb-2 rounded-md hover:bg-color-pallet-04 shadow-md text-text-color-dark-green font-semibold text-xl"
      >
        Send
      </button>
    </form>
  ) : (
    <div className="flex flex-col ">
      <div className="mx-auto">
        <button
          onClick={() => setPreviewIsActive(!previewIsActive)}
          className="bg-color-pallet-03 ml-4 py-2 px-6 mx-auto mt-4 mb-2 rounded-md hover:bg-color-pallet-04 shadow-md text-text-color-dark-green font-semibold text-xl"
        >
          Edit
        </button>
      </div>
      <div className="max-w-[600px] mx-auto bg-white border-1 border-solid border-gray-400">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs50tQXbmy1sghOyjzYhg2yOjzO40hK7XR0g&s"
          alt="image not found"
          className="w-full"
        />
        {sections.map((section) => (
          <>
            {section.imageUrl && (
              <img
                src={section.imageUrl}
                alt="image not found"
                className="w-full"
              />
            )}
            <div className="p-5">
              {section.title && (
                <h2 className="text-gray-700 text-center font-semibold text-xl">
                  {section.title}
                </h2>
              )}

              {section.message && (
                <p className="text-gray-600 leading-6 text-medium text-center">
                  {section.message}
                </p>
              )}

              {section.buttonName && (
                <p className="pt-5 text-center">
                  <a
                    href={section.buttonLink}
                    className="inline-block bg-color-pallet-03 text-white px-5 py-3 no-underline rounded-md font-medium"
                  >
                    {section.buttonName
                      ? section.buttonName
                      : "Input button name"}
                  </a>
                </p>
              )}
            </div>
          </>
        ))}
        <div className="text-center p-3 text-sm text-gray-400">
          <p>
            You're receiving this email because you subscribed to our
            newsletter.
          </p>
          <p>
            If you no longer wish to receive these emails, you can{" "}
            <a href="[Unsubscribe Link]" className="text-blue-500 no-underline">
              unsubscribe here
            </a>
            .
          </p>
          <p>
            &copy; {new Date().getFullYear()} DoDo ir SeSe. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
