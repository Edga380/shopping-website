"use client";

import React, { useEffect, useState, useRef } from "react";
import { SlideShowImages } from "../../types/databaseTypes";
import { getSlideShowImages } from "../../database/models/slideShow/getSlideShowImages";
import addSlideShowImage from "../../database/models/slideShow/addSlideShowImage";
import deleteSlideShowImage from "../../database/models/slideShow/deleteSlideShowImage";
import moveLeftSlideShowImageSpot from "../../database/models/slideShow/moveLeftSlideShowImageSpot";
import moveRightSlideShowImageSpot from "../../database/models/slideShow/moveRightSlideShowImageSpot";

export default function AdminSlideShow() {
  const [slideshowImages, setSlideshowImages] = useState<SlideShowImages[]>([]);
  const [refreshImages, setRefeshImages] = useState<number>(0);
  const fileInputReference = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchSlideShowImages = async () => {
      setSlideshowImages(
        (await getSlideShowImages()).sort((a, b) => a.image_spot - b.image_spot)
      );
    };
    fetchSlideShowImages();
  }, [refreshImages]);

  const handleImageInputOnChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files) {
      const newImage = Array.from(files);

      const duplicateImages = slideshowImages.some((image) =>
        image.path.includes(newImage[0].name)
      );

      if (duplicateImages) {
        alert(
          `Images with the same name are not allowed: "${newImage[0].name}"`
        );
      }
      if (fileInputReference.current) {
        fileInputReference.current.value = "";
      }
    }
  };

  const handleSubmitNewImage = async (
    event: React.ChangeEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    await addSlideShowImage(slideshowImages.length + 1, formData);
    setRefeshImages((refreshImages) => refreshImages + 1);
  };

  const handleImageDelete = async (imageId: number, path: string) => {
    await deleteSlideShowImage(imageId, path);
    setSlideshowImages(slideshowImages.filter((image) => image.path !== path));
  };

  const handleMoveImageLeft = async (imageId: number, imageSpot: number) => {
    await moveLeftSlideShowImageSpot(imageId, imageSpot);
    setRefeshImages((refreshImages) => refreshImages + 1);
  };

  const handleMoveImageRight = async (imageId: number, imageSpot: number) => {
    await moveRightSlideShowImageSpot(imageId, imageSpot);
    setRefeshImages((refreshImages) => refreshImages + 1);
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <div>
          <a className="text-text-color-dark-green text-2xl">
            Active slideshow images
          </a>
          <div
            className={`grid ${
              slideshowImages.length < 2 ? "grid-cols-1" : "grid-cols-3"
            }`}
          >
            {slideshowImages.length === 0 && (
              <a className="text-red-800 text-lg">
                No slideshow images selected.
              </a>
            )}
            {slideshowImages.map((image) => (
              <div
                className="flex flex-col items-center m-2"
                key={image.image_id}
              >
                <div className="relative">
                  <a className="absolute m-2 text-lg font-bold text-text-color-dark-green">
                    {image.image_spot}
                  </a>
                  <img
                    key={image.image_id}
                    src={`/slideShow/${image.path}`}
                    alt={image.path}
                    height={200}
                    width={300}
                  />
                </div>
                <div>
                  {image.image_spot > 1 ? (
                    <button
                      onClick={() =>
                        handleMoveImageLeft(image.image_id, image.image_spot)
                      }
                      className="bg-color-pallet-03 text-lg font-bold text-text-color-dark-green my-4 px-3 py-2 mr-2 rounded hover:bg-color-pallet-04 m-auto"
                    >
                      Move Left
                    </button>
                  ) : (
                    <button className="bg-gray-500 text-lg font-bold text-gray-400 my-4 px-3 py-2 mr-2 rounded m-auto">
                      Move Left
                    </button>
                  )}
                  <button
                    onClick={() =>
                      handleImageDelete(image.image_id, image.path)
                    }
                    className="bg-red-500 text-lg font-bold text-text-color-dark-green my-4 px-3 py-2 mr-2 rounded hover:bg-red-700 m-auto"
                  >
                    Remove
                  </button>
                  {image.image_spot < slideshowImages.length ? (
                    <button
                      onClick={() =>
                        handleMoveImageRight(image.image_id, image.image_spot)
                      }
                      className="bg-color-pallet-03 text-lg font-bold text-text-color-dark-green my-4 px-3 py-2 rounded hover:bg-color-pallet-04 m-auto"
                    >
                      Move Right
                    </button>
                  ) : (
                    <button className="bg-gray-500 text-lg font-bold text-gray-400 my-4 px-3 py-2 mr-2 rounded m-auto">
                      Move Right
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <a className="text-text-color-dark-green text-2xl">
            Add new slideshow image
          </a>
          <form onSubmit={handleSubmitNewImage} className="flex flex-col">
            <input
              type="file"
              id="image"
              name="image"
              className="text-text-color-dark-green py-2 pl-2 mt-2 bg-color-pallet-03 rounded"
              onChange={handleImageInputOnChange}
              ref={fileInputReference}
              required
            />
            <button
              type="submit"
              className="bg-color-pallet-03 text-lg font-bold text-text-color-dark-green my-4 px-3 py-2 rounded hover:bg-color-pallet-04"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
