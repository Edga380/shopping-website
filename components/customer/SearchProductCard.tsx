"use client";

import Link from "next/link";
import Image from "next/image";
import { UpdatedProduct } from "../../types/databaseTypes";

export default function SearchProductCard({
  product,
  toggleSearchBar,
  handleClearSearchInput,
}: {
  product: UpdatedProduct;
  toggleSearchBar: () => void;
  handleClearSearchInput: () => void;
}) {
  console.log(product.product_variations);
  return (
    <Link
      href={`/products/${product.product_id}/product`}
      onClick={() => {
        toggleSearchBar();
        handleClearSearchInput();
      }}
    >
      <div className="flex transition-all duration-300 transform hover:scale-105 hover:bg-color-pallet-04 hover:underline rounded-[0.5rem] p-2 m-2">
        <div className="h-14 w-20 overflow-hidden rounded">
          <Image
            src={`${
              product.product_variations[0].images.length === 0
                ? "/products/product_not_found.svg"
                : `${product.product_variations[0].images[0]}`
            }`}
            width={208}
            height={208}
            alt={`${product.product_variations[0].images[0]}`}
            className="scale-125"
          ></Image>
        </div>
        <div className="text-text-color-dark-green m-auto text-xl font-semibold">
          {product.name}
        </div>
      </div>
    </Link>
  );
}
