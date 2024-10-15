"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { SlideShowImages } from "../../types/databaseTypes";
import { getSlideShowImages } from "../../database/models/slideShow/getSlideShowImages";
import addSlideShowImage from "../../database/models/slideShow/addSlideShowImage";
import deleteSlideShowImage from "../../database/models/slideShow/deleteSlideShowImage";
import moveLeftSlideShowImageSpot from "../../database/models/slideShow/moveLeftSlideShowImageSpot";
import moveRightSlideShowImageSpot from "../../database/models/slideShow/moveRightSlideShowImageSpot";

export default function AdminSlideShow() {
  const [slideshowImages, setSlideshowImages] = useState<SlideShowImages[]>([]);
  const [newSlideshowImage, setNewSlideshowImage] = useState<File | null>(null);
  const fileInputReference = useRef<HTMLInputElement | null>(null);
  const [isActiveDeleteModal, setIsActiveDeleteModal] = useState<number | null>(
    null
  );
  const [trigger, setTrigger] = useState<number>(0);
  const [messageData, setMessageData] = useState<{
    message: string;
    color: string;
  }>({ message: "", color: "" });

  useEffect(() => {
    const fetchSlideShowImages = async () => {
      const slideShowImages = await getSlideShowImages();
      setSlideshowImages(
        slideShowImages.sort((a, b) => a.image_spot - b.image_spot)
      );
    };
    fetchSlideShowImages();
  }, [trigger]);

  const handleImageInputOnChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMessageData({
      message: "",
      color: "red",
    });

    const files = event.target.files;
    if (files) {
      const newImage = Array.from(files);

      const duplicateImages = slideshowImages.some((image) =>
        image.path.includes(newImage[0].name)
      );

      if (duplicateImages) {
        setMessageData({
          message: `Images with the same name are not allowed: "${newImage[0].name}"`,
          color: "red",
        });

        if (fileInputReference.current) {
          fileInputReference.current.value = "";
        }

        return;
      }

      setNewSlideshowImage(newImage[0]);

      if (fileInputReference.current) {
        fileInputReference.current.value = "";
      }
    }
  };

  const handleSubmitNewImage = async (
    event: React.ChangeEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const newImageFormData = new FormData();

    if (newSlideshowImage) {
      const imageSpot =
        slideshowImages.length - 1 < 0 ? 1 : slideshowImages.length + 1;
      newImageFormData.append("newImage", newSlideshowImage);
      await addSlideShowImage(imageSpot, newImageFormData);
      setNewSlideshowImage(null);
      setTrigger((prev) => prev + 1);
    } else {
      setMessageData({ message: "Select image to submit.", color: "red" });
      return;
    }
  };

  const handleImageDelete = async (imageId: number, path: string) => {
    await deleteSlideShowImage(imageId, path);
    setTrigger((prev) => prev + 1);
  };

  const handleMoveImageLeft = async (imageId: number, imageSpot: number) => {
    await moveLeftSlideShowImageSpot(imageId, imageSpot);
    setTrigger((prev) => prev + 1);
  };

  const handleMoveImageRight = async (imageId: number, imageSpot: number) => {
    await moveRightSlideShowImageSpot(imageId, imageSpot);
    setTrigger((prev) => prev + 1);
  };

  return (
    <>
      <div className="items-center mt-2 px-2 bg-color-pallet-03 text-text-color-dark-green text-lg font-semibold shadow-md">
        Active Images
      </div>
      <div className="flex flex-wrap justify-center">
        {slideshowImages
          .sort((a, b) => a.image_spot - b.image_spot)
          .map((image, index) => (
            <div
              key={`${image.image_id}-${index}`}
              className="bg-color-pallet-02 shadow-md w-[20rem] pb-6 mx-2 text-xl text-center m-2"
            >
              <div className="bg-color-pallet-03 p-2 font-bold text-text-color-dark-green">
                {image.path}
              </div>
              <div className="bg-color-pallet-03 p-2 font-bold text-2xl text-text-color-dark-green">
                Image spot [ {image.image_spot} ]
              </div>
              <div className="flex flex-col justify-center mt-6">
                <Image
                  key={`${image.image_id}-${index}`}
                  width={350}
                  height={200}
                  src={`/slideShow/${image.path}`}
                  alt={`${image.path}`}
                  className="object-scale-down bg-color-pallet-02 p-4"
                />
                <div className="flex flex-row text-lg font-bold text-text-color-dark-green">
                  <button
                    onClick={() =>
                      handleMoveImageLeft(image.image_id, image.image_spot)
                    }
                    className={`${
                      index === 0
                        ? "bg-gray-500"
                        : "bg-color-pallet-03 hover:bg-color-pallet-04"
                    } px-3 py-2 rounded m-auto`}
                    disabled={index === 0}
                  >
                    <span className="text-2xl">&#x25C0;</span>
                  </button>
                  <button
                    onClick={() => setIsActiveDeleteModal(image.image_id)}
                    className="bg-red-500 px-3 py-2 rounded hover:bg-red-700 m-auto"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() =>
                      handleMoveImageRight(image.image_id, image.image_spot)
                    }
                    className={`${
                      index === slideshowImages.length - 1
                        ? "bg-gray-500"
                        : "bg-color-pallet-03 hover:bg-color-pallet-04"
                    } px-3 py-2 rounded m-auto`}
                    disabled={index === slideshowImages.length - 1}
                  >
                    <span className="text-2xl">&#x25B6;</span>
                  </button>
                </div>
              </div>
              {isActiveDeleteModal === image.image_id && (
                <div className="fixed left-0 top-0 bg-black/[.6] w-full h-full flex justify-center items-center z-10">
                  <div className="bg-color-pallet-02 w-80 h-44 rounded-lg relative flex flex-col justify-center items-center">
                    <div className="font-semibold text-lg mx-2">
                      Are you sure you want to delete
                    </div>
                    <div className="font-bold text-xl mx-2">
                      <span className="font-semibold text-lg">
                        slideshow image:
                      </span>{" "}
                      {image.path}
                    </div>
                    <div className="pt-6 flex justify-center space-x-4">
                      <button
                        className="text-lg font-bold text-white rounded bg-red-500 hover:bg-red-700 px-6 shadow-md"
                        onClick={() =>
                          handleImageDelete(image.image_id, image.path)
                        }
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
      </div>
      <form
        onSubmit={handleSubmitNewImage}
        className="flex flex-col bg-color-pallet-02 w-96 rounded mt-2 mx-auto shadow-md"
      >
        <div className="bg-color-pallet-03 text-center text-lg font-bold text-text-color-dark-green py-2 mx-auto w-full">
          {newSlideshowImage === null ? "Add Image" : newSlideshowImage.name}
        </div>
        {newSlideshowImage && (
          <Image
            key={newSlideshowImage.name}
            width={350}
            height={200}
            src={URL.createObjectURL(newSlideshowImage)}
            alt={newSlideshowImage.name}
            className="object-scale-down bg-color-pallet-02 p-4 mx-auto"
          />
        )}
        {messageData.message ? (
          <div
            className="font-bold text-center text-text-color-dark-green mx-auto"
            style={{ color: `${messageData.color}` }}
          >
            {messageData.message}
          </div>
        ) : (
          <div className="p-3"></div>
        )}
        <input
          type="file"
          id="image"
          name="image"
          className="text-text-color-dark-green py-2 pl-2 mt-2 bg-color-pallet-03 rounded"
          onChange={handleImageInputOnChange}
          ref={fileInputReference}
        />
        <button
          className="bg-color-pallet-03 text-lg font-bold text-text-color-dark-green px-3 py-2 rounded shadow-md mx-auto my-2 hover:bg-color-pallet-04"
          type="submit"
        >
          Submit
        </button>
      </form>
    </>
  );
}
