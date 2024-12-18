"use client";

import Image from "next/image";
import { useState } from "react";
import { SlideShowImages } from "../../types/databaseTypes";

export default function SlideShow({
  slideShowImages,
}: {
  slideShowImages: SlideShowImages[];
}) {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const prevBtn = () => {
    if (0 === currentSlide) {
      setCurrentSlide(slideShowImages.length - 1);
    } else {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const nextBtn = () => {
    if (slideShowImages.length - 1 === currentSlide) {
      setCurrentSlide(0);
    } else {
      setCurrentSlide(currentSlide + 1);
    }
  };
  return (
    <div className="my-10 relative h-[500px] md:h-[600px] lg:h-[700px] rounded-3xl overflow-hidden">
      <div className="absolute top-0 left-0 h-full flex z-10">
        <button
          className="max-w-6 ml-2 self-center transition-transform duration-300 transform hover:scale-110"
          onClick={prevBtn}
        >
          <Image
            src="/prev_img.svg"
            width={40}
            height={40}
            alt="Previous slide button"
          ></Image>
        </button>
      </div>
      <div className="absolute top-0 right-0 h-full flex z-10">
        <button
          className="max-w-6 mr-2 self-center transition-transform duration-300 transform hover:scale-110"
          onClick={nextBtn}
        >
          <Image
            src="/next_img.svg"
            width={40}
            height={40}
            alt="Next slide button"
          ></Image>
        </button>
      </div>
      <div className="absolute bottom-0 left-0 w-full flex justify-center mb-4 z-10">
        <div className="align-middle flex border-color-pallet-01 border-2 p-1 rounded-lg">
          {slideShowImages.map((_, index) => (
            <button
              key={index}
              className={`w-4 h-4 mx-1 rounded-full transition-transform duration-300 transform hover:scale-110 ${
                currentSlide === index
                  ? "bg-color-pallet-03"
                  : "bg-color-pallet-01"
              }`}
              onClick={() => setCurrentSlide(index)}
            ></button>
          ))}
        </div>
      </div>
      <button className="w-full h-full">
        {slideShowImages.length === 0 ? (
          <Image
            src={`/notFoundImages/slideshow_not_found.svg`}
            height={200}
            width={200}
            className="w-full h-full object-cover"
            alt="Slide show image not found."
          ></Image>
        ) : (
          <Image
            src={`/slideShow/${slideShowImages[currentSlide].path}`}
            height={200}
            width={200}
            className="w-full h-full object-cover"
            alt={`${slideShowImages[currentSlide].path}`}
          ></Image>
        )}
      </button>
    </div>
  );
}
