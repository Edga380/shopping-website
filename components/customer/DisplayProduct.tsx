"use client";

import { useState } from "react";
import { UpdatedProduct } from "../../types/databaseTypes";
import Link from "next/link";
import ProductImages from "./ProductImages";

export default function DisplayProduct({
  product,
}: {
  product: UpdatedProduct;
}) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedQuantity, setSelectedQuantity] = useState<number>(0);

  const handleSetSelectedSize = (size: string) => {
    setSelectedSize(size);
  };

  const handleSetSelectedColor = (color: string) => {
    setSelectedColor(color);
  };

  const handleSetSelectedQuantity = (sign: string) => {
    if (sign === "minus" && selectedQuantity > 0) {
      setSelectedQuantity((prev) => prev - 1);
    } else if (sign === "plus" && selectedQuantity < 10) {
      setSelectedQuantity((prev) => prev + 1);
    }
  };

  return (
    <div>
      <Link
        href={"/products"}
        className="text-lg font-bold text-text-color-dark-green m-100 px-3 py-2 rounded hover:bg-color-pallet-04"
      >
        &larr; Back
      </Link>
      <div className="flex w-full mt-4">
        <div className="w-2/3">
          <ProductImages images={product.images} />
        </div>
        <div className="flex flex-col p-8 w-2/6">
          <div className="text-text-color-dark-green font-semibold text-2xl mb-2">
            {product.name}
          </div>
          <div className="text-text-color-dark-green font-semibold text-2xl mb-2">
            {product.priceInPennies / 100}£
          </div>
          <div className="text-text-color-dark-green font-semibold text-2xl mb-2">
            <div>Select size: {selectedSize}</div>
            {product.sizes.map((size, index) => (
              <button
                key={size + index}
                onClick={() => handleSetSelectedSize(size)}
                className={`bg-color-pallet-03 w-14 h-14 mr-2 hover:bg-color-pallet-02 rounded-md ${
                  selectedSize === size && "border-2 border-color-pallet-04"
                }`}
              >
                {size}
              </button>
            ))}
            <div>
              <button className="text-text-color-dark-green text-sm underline">
                Size guide
              </button>
            </div>
          </div>
          <div className="text-text-color-dark-green font-semibold text-2xl mb-2 ">
            <div>Select color: {selectedColor}</div>
            <div>
              {product.colors.map((color, index) => (
                <button
                  key={color + index}
                  onClick={() => handleSetSelectedColor(color)}
                  className={`w-10 h-10 mr-2 hover:bg-color-pallet-02 rounded-md ${
                    selectedColor === color && "border-2 border-color-pallet-04"
                  }`}
                  style={{
                    background: `${
                      color === "Multi"
                        ? "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)"
                        : color
                    }`,
                  }}
                ></button>
              ))}
            </div>
          </div>
          <div className="text-text-color-dark-green font-semibold text-2xl mb-2 ">
            <div>Quantity</div>
            <div className="flex justify-between">
              <div className="flex bg-color-pallet-03 py-2 px-4 rounded-md">
                <button
                  onClick={() => handleSetSelectedQuantity("minus")}
                  className="w-4 h-4 transition-transform transform duration-300 hover:scale-110"
                >
                  -
                </button>
                <div className="mx-4 w-6 text-center">{selectedQuantity}</div>
                <button
                  onClick={() => handleSetSelectedQuantity("plus")}
                  className="w-4 h-4 transition-transform transform duration-300 hover:scale-110"
                >
                  +
                </button>
              </div>
              <button className="bg-color-pallet-03 hover:bg-color-pallet-04 p-2 rounded-md shadow-xl border-2 border-color-pallet-04">
                Add to cart
              </button>
            </div>
          </div>
          <div className="bg-color-pallet-02 border-2 border-color-pallet-04 text-text-color-dark-green font-semibold p-2 mb-2 rounded-md">
            {product.description}
          </div>
        </div>
      </div>
    </div>
  );
}
