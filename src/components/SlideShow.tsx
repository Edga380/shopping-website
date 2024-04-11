"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function SlideShow() {
  const [currentSlide, setCurrentSlide] = useState(
    "/slideShow/slideshow_img_01.svg"
  );

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("/slideShow");
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.log("Error fetching images: ", error);
      }
    };

    fetchImages();
  }, []);

  const prevBtn = () => {
    setCurrentSlide("/slideShow/slideshow_img_01.svg");
  };

  const nextBtn = () => {
    setCurrentSlide("/slideShow/slideshow_img_02.svg");
  };
  return (
    <div className="my-10 w-11/12 relative">
      <button
        className="absolute left-5 top-1/2 w-6 transition-transform duration-300 transform hover:scale-110"
        onClick={prevBtn}
      >
        <Image
          src="/prev_img.svg"
          width={40}
          height={40}
          alt="Previous slide button"
        ></Image>
      </button>
      <button
        className="absolute right-5 top-1/2 w-6 transition-transform duration-300 transform hover:scale-110"
        onClick={nextBtn}
      >
        <Image
          src="/next_img.svg"
          width={40}
          height={40}
          alt="Next slide button"
        ></Image>
      </button>
      <Image
        src={currentSlide}
        width={1920}
        height={1080}
        className="w-100% h-auto object-cover rounded-3xl"
        alt=""
      ></Image>
    </div>
  );
}
