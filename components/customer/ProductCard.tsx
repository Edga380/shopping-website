"use client";

import Link from "next/link";
import Image from "next/image";

type ProductCard = {
  src: string;
  name: string;
  price: number;
  productLink: string;
};

export default function ProductCard({
  src,
  name,
  price,
  productLink,
}: ProductCard) {
  return (
    <div className="flex flex-col m-4 items-center rounded-2xl">
      <div className="product-card h-[18vw]">
        <Link href={productLink}>
          <Image
            src={src}
            height={400}
            width={700}
            alt={name}
            className="transition-transform duration-300 transform hover:scale-110"
          />
        </Link>
      </div>
      <p className="text-text-color-dark-green font-bold text-2xl mt-2">
        {name}
      </p>
      <p className="text-text-color-dark-green font-semibold text-xl">
        {`£${price}`}
      </p>
    </div>
  );
}
