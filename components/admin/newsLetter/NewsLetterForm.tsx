"use client";

import { useRef, useState } from "react";
import sendNewsLetter from "../../../database/models/user/sendNewsLetter";
import {
  NewsLetterSection,
  NewsLetterEmailsData,
} from "../../../types/databaseTypes";
import { Image } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function NewsLetterForm({
  emailsData,
}: {
  emailsData: NewsLetterEmailsData[] | undefined;
}) {
  const fileInputReference = useRef<(HTMLInputElement | null)[]>([]);
  const [isActiveDeleteModal, setIsActiveDeleteModal] = useState<number | null>(
    null
  );
  const [subject, setSubject] = useState<string>("");
  const [sections, setSections] = useState<NewsLetterSection[]>([]);
  const [selectedImages, setSelectedImages] = useState<
    { imageId: number; imageFile: File | undefined }[]
  >([]);
  const [previewIsActive, setPreviewIsActive] = useState<boolean>(false);
  const [messageData, setMessage] = useState<{
    message: string;
    color: string;
  }>({ message: "", color: "" });
  const router = useRouter();

  const handleAddSection = () => {
    const date = new Date();
    const time = date.getTime();
    setSections([
      ...sections,
      {
        sectionId: time,
        title: "",
        imageUrl: "",
        message: "",
        buttonLink: "",
        buttonName: "",
      },
    ]);
    setSelectedImages([
      ...selectedImages,
      { imageId: time, imageFile: undefined },
    ]);
  };

  const handleAddImage = (
    event: React.ChangeEvent<HTMLInputElement>,
    sectionId: number
  ) => {
    const files = event.target.files;
    if (files) {
      const newImage = Array.from(files);

      const createObjectURL = URL.createObjectURL(newImage[0]);

      setSections(
        sections.map((section) =>
          section.sectionId === sectionId
            ? { ...section, imageUrl: createObjectURL }
            : section
        )
      );

      setSelectedImages(
        selectedImages.map((selectedImage) =>
          selectedImage.imageId === sectionId
            ? { ...selectedImage, imageFile: newImage[0] }
            : selectedImage
        )
      );

      if (fileInputReference.current[sectionId]) {
        fileInputReference.current[sectionId].value = "";
      }
    }
  };

  const handleRemoveImage = (imageId: number) => {
    setSections(
      sections.map((section) =>
        section.sectionId === imageId ? { ...section, imageUrl: "" } : section
      )
    );
    setSelectedImages(
      selectedImages.map((selectedImage) =>
        selectedImage.imageId === imageId
          ? { ...selectedImage, imageFile: undefined }
          : selectedImage
      )
    );
  };

  const handleRemoveSection = (sectionId: number) => {
    const updatedSections = sections.filter(
      (section) => section.sectionId !== sectionId
    );
    setSections(updatedSections);
    setSelectedImages(
      selectedImages.filter(
        (selectedImage) => selectedImage.imageId !== sectionId
      )
    );
    setIsActiveDeleteModal(null);
  };

  const handleSubmitNewsLetter = async () => {
    setMessage({
      message: "",
      color: "",
    });
    if (emailsData === undefined || emailsData.length === 0) {
      setMessage({
        message: "Empty 'emailsData' variable.",
        color: "red",
      });
      return;
    }
    const imageFilesFormData = new FormData();

    selectedImages.forEach(({ imageId, imageFile }) => {
      if (imageFile === undefined) {
        setMessage({
          message: "Every Section must have an image.",
          color: "red",
        });
        return;
      }
      imageFilesFormData.append(`imageFile-${imageId}`, imageFile);
    });

    if (
      !subject.trim() ||
      !sections.every((section) => {
        const { buttonLink, buttonName, imageUrl, message, title } = section;
        return [buttonLink, buttonName, imageUrl, message, title].every(
          (field) => field.trim()
        );
      })
    ) {
      setMessage({
        message: !subject.trim() ? "Subject required." : "All fields required.",
        color: "red",
      });
      return;
    }

    try {
      await sendNewsLetter(emailsData, subject, sections, imageFilesFormData);

      setMessage({
        message: "NewsLetter sent successfully.",
        color: "green",
      });

      router.push("/admin/newsLetter");
    } catch (error) {
      console.error(error);
      setMessage({
        message: "Something went wrong. Can't send NewsLetter.",
        color: "red",
      });
    }
  };

  return !previewIsActive ? (
    <div className="bg-color-pallet-02 mt-2 mb-48 max-w-[60rem] mx-auto shadow-md">
      <div className="flex flex-col">
        <div className="bg-color-pallet-03 text-xl text-center font-bold text-text-color-dark-green p-2">
          Subject
        </div>
        <input
          type="text"
          placeholder="Input Subject"
          defaultValue={subject}
          onChange={(event) => setSubject(event.currentTarget.value)}
          className="p-2 m-2 rounded"
        />
        {sections.map((section, index) => (
          <div className="flex flex-col" key={index}>
            <div className="bg-color-pallet-04 relative text-2xl text-center font-bold text-text-color-dark-green p-6">
              <span className="text-2xl">&#x25C0;</span> [{" "}
              {section.title ? section.title : `Section ${index + 1}`} ]{" "}
              <span className="text-2xl">&#x25B6;</span>
              <button
                type="button"
                onClick={() => setIsActiveDeleteModal(index)}
                className="bg-red-500 absolute py-1 px-4 right-2 rounded-md hover:bg-red-700 shadow-md text-text-color-dark-green font-semibold text-xl"
              >
                X
              </button>
            </div>
            <div className="bg-color-pallet-03 text-xl text-center font-bold text-text-color-dark-green p-2 mt-2">
              Image
            </div>
            <div className="bg-color-pallet-03 flex flex-col items-center mt-2">
              {section.imageUrl && (
                <div className="flex flex-col items-center">
                  <Image
                    src={section.imageUrl}
                    alt={section.imageUrl}
                    className="max-w-[600px] m-2 rounded-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(section.sectionId)}
                    className="bg-red-500 ml-4 py-2 px-6 mt-4 mb-2 rounded-md hover:bg-red-700 shadow-md text-text-color-dark-green font-semibold text-xl"
                  >
                    Remove
                  </button>
                </div>
              )}
              <input
                type="file"
                id="image"
                name="image"
                className="py-2 pl-2 mx-auto"
                onChange={(event) => handleAddImage(event, section.sectionId)}
                ref={(element) => {
                  fileInputReference.current[section.sectionId] = element;
                }}
              />
            </div>
            <div className="bg-color-pallet-03 text-xl text-center font-bold text-text-color-dark-green p-2 mt-2">
              Title
            </div>
            <input
              type="text"
              placeholder="Input Title"
              value={section.title}
              onChange={(event) => {
                const updatedSections = [...sections];
                updatedSections[index].title = event.currentTarget.value;
                setSections(updatedSections);
              }}
              className="p-2 m-2 rounded"
            />
            <div className="bg-color-pallet-03 text-xl text-center font-bold text-text-color-dark-green p-2">
              Message
            </div>
            <textarea
              placeholder="Input Message"
              value={section.message}
              onChange={(event) => {
                const updatedSections = [...sections];
                updatedSections[index].message = event.currentTarget.value;
                setSections(updatedSections);
              }}
              className="p-2 m-2 rounded h-72"
            />
            <div className="bg-color-pallet-03 text-xl text-center font-bold text-text-color-dark-green p-2">
              Button Link
            </div>
            <input
              type="text"
              placeholder="Input Button Link"
              value={section.buttonLink}
              onChange={(event) => {
                const updatedSections = [...sections];
                updatedSections[index].buttonLink = event.currentTarget.value;
                setSections(updatedSections);
              }}
              className="p-2 m-2 rounded"
            />
            <div className="bg-color-pallet-03 text-xl text-center font-bold text-text-color-dark-green p-2">
              Button Name
            </div>
            <input
              type="text"
              placeholder="Input Button Name"
              value={section.buttonName}
              onChange={(event) => {
                const updatedSections = [...sections];
                updatedSections[index].buttonName = event.currentTarget.value;
                setSections(updatedSections);
              }}
              className="p-2 m-2 rounded"
            />
            {isActiveDeleteModal === index && (
              <div className="fixed left-0 top-0 bg-black/[.6] w-full h-full flex justify-center items-center z-10">
                <div className="bg-color-pallet-02 w-80 h-44 rounded-lg relative flex flex-col justify-center items-center">
                  <div className="font-semibold text-lg mx-2">
                    Are you sure you want to remove:
                  </div>
                  <div className="font-bold text-xl mx-2">
                    {section.title ? section.title : `Section ${index + 1}`}
                  </div>
                  <div className="pt-6 flex justify-center space-x-4">
                    <button
                      className="text-lg font-bold text-white rounded bg-red-500 hover:bg-red-700 px-6 shadow-md"
                      onClick={() => handleRemoveSection(section.sectionId)}
                    >
                      Confirm
                    </button>
                    <button
                      className="text-lg font-bold text-text-color-dark-green rounded bg-color-pallet-03 hover:bg-color-pallet-04 px-6 shadow-md"
                      onClick={() => setIsActiveDeleteModal(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        <div className="mx-auto my-6">
          <button
            type="button"
            onClick={() => handleAddSection()}
            className="bg-color-pallet-03 mr-4 py-2 px-6 mx-auto mb-2 rounded-md hover:bg-color-pallet-04 shadow-md text-text-color-dark-green font-semibold text-xl"
          >
            Add Section
          </button>
          <button
            type="button"
            onClick={() => setPreviewIsActive(!previewIsActive)}
            className="bg-color-pallet-03 ml-4 py-2 px-6 mx-auto mb-2 rounded-md hover:bg-color-pallet-04 shadow-md text-text-color-dark-green font-semibold text-xl"
          >
            Preview
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-color-pallet-02 flex flex-col mt-2 mb-48 max-w-[60rem] mx-auto shadow-md">
      <div className="bg-color-pallet-04 relative text-2xl text-center font-bold text-text-color-dark-green p-6 mb-6">
        <button
          onClick={() => setPreviewIsActive(!previewIsActive)}
          className="bg-color-pallet-03 absolute left-2 top-0 ml-4 py-2 px-6 mx-auto mt-4 mb-2 hover:bg-color-pallet-04 shadow-md text-text-color-dark-green font-semibold text-xl rounded"
        >
          Back
        </button>
        <span className="text-2xl">&#x25C0;</span> [ Preview ]{" "}
        <span className="text-2xl">&#x25B6;</span>
      </div>
      <div className="max-w-[600px] mx-auto bg-white border-1 border-solid border-gray-400 mb-6">
        <Image
          src="/notFoundImages/slideshow_not_found.svg"
          alt="image not found"
          className="w-full rounded-none"
        />
        {sections.map((section, index) => (
          <>
            {section.imageUrl && (
              <Image
                src={section.imageUrl}
                alt="image not found"
                className="w-full rounded-none"
              />
            )}
            <div key={index} className="p-5">
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
            You are receiving this email because you subscribed to our
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

      {messageData.message ? (
        <div
          className="font-bold text-text-color-dark-green mx-auto"
          style={{ color: `${messageData.color}` }}
        >
          {messageData.message}
        </div>
      ) : (
        <div className="p-3"></div>
      )}
      <button
        onClick={() => handleSubmitNewsLetter()}
        className="bg-color-pallet-03 flex self-center py-2 px-6 mt-4 mb-6 hover:bg-color-pallet-04 shadow-md text-text-color-dark-green font-semibold text-xl rounded"
      >
        Send
      </button>
    </div>
  );
}
