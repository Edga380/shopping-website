"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProductImages({ images }: { images: string[] }) {
  const [selectedImage, setSelectedImage] = useState<string>(images[0]);

  const handleSelectedImage = (image: string) => {
    setSelectedImage(image);
  };

  return (
    <div className="flex">
      {images.length > 0 ? (
        <>
          <div className="flex flex-wrap w-1/4 mb-auto">
            {images.map((image, index) => (
              <button key={index} onClick={() => handleSelectedImage(image)}>
                <Image
                  src={`${image}`}
                  width={100}
                  height={100}
                  alt={image}
                  className="m-4"
                ></Image>
              </button>
            ))}
          </div>
          <div className="py-4 mx-auto">
            <Image
              key={images[0]}
              src={`${selectedImage}`}
              width={800}
              height={600}
              alt={images[0]}
            ></Image>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-wrap w-1/4 mb-auto"></div>
          <div className="py-4 mx-auto">
            <Image
              key={images[0]}
              src={`/products/product_not_found.svg`}
              width={800}
              height={600}
              alt={images[0]}
            ></Image>
          </div>
        </>
      )}
    </div>
  );
}
