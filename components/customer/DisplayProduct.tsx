"use client";

import { useState } from "react";
import { UpdatedProduct, UserData } from "../../types/databaseTypes";
import Link from "next/link";
import ProductImages from "./ProductImages";
import addToCart from "../../database/models/product/addToCart";

export default function DisplayProduct({
  product,
  userData,
}: {
  product: UpdatedProduct;
  userData: UserData | undefined;
}) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>(
    product.product_variations[0].color
  );
  const [selectedQuantity, setSelectedQuantity] = useState<number>(0);
  const [messageData, setMessageData] = useState<{
    message: string;
    color: string;
  }>({ message: "", color: "" });

  const handleSetSelectedSize = (size: string) => {
    setSelectedSize(size);
  };

  const handleSetSelectedColor = (color: string) => {
    setSelectedColor(color);
    setSelectedSize("");
  };

  const handleSetSelectedQuantity = (sign: string) => {
    if (sign === "minus" && selectedQuantity > 0) {
      setSelectedQuantity((prev) => prev - 1);
    } else if (sign === "plus" && selectedQuantity < 10) {
      setSelectedQuantity((prev) => prev + 1);
    }
  };

  const handleAddToCart = async () => {
    setMessageData({ message: "", color: "" });

    if (!userData) return;

    if (!selectedSize) {
      setMessageData({ message: "Please select Size.", color: "red" });
      return;
    }

    if (!selectedColor) {
      setMessageData({ message: "Please select Color.", color: "red" });
      return;
    }

    if (!selectedQuantity) {
      setMessageData({ message: "Please select Quantity.", color: "red" });
      return;
    }

    const productVariationId = product.product_variations.find(
      (product_variation) => product_variation.color === selectedColor
    )?.product_variation_id;

    if (!productVariationId) return;

    try {
      await addToCart(
        userData.user_id,
        product.product_id,
        productVariationId,
        selectedSize,
        selectedQuantity
      );
      setMessageData({
        message: "Product added to your cart.",
        color: "green",
      });
    } catch (error) {
      throw error;
    }
  };

  return (
    <div>
      <Link
        href={"/products"}
        className="text-lg font-bold text-text-color-dark-green m-100 px-3 py-2 rounded hover:bg-color-pallet-04"
      >
        &larr; Products
      </Link>
      <div className="flex w-full mt-4">
        <div className="w-2/3">
          <ProductImages
            images={product.product_variations.flatMap(
              (product_variation) => product_variation.images
            )}
          />
        </div>
        <div className="flex flex-col p-8 w-2/6">
          <div className="text-text-color-dark-green font-semibold text-2xl mb-2">
            {product.name}
          </div>
          <div className="text-text-color-dark-green font-semibold text-2xl mb-2">
            {product.base_price_in_pennies / 100}£
          </div>
          <div className="text-text-color-dark-green font-semibold text-2xl mb-2 ">
            <div>Color: {selectedColor}</div>
            <div>
              {product.product_variations.map((product_variation, index) => (
                <button
                  key={product_variation.color + index}
                  onClick={() =>
                    handleSetSelectedColor(product_variation.color)
                  }
                  className={`w-10 h-10 mr-2 hover:bg-color-pallet-02 rounded-md ${
                    selectedColor === product_variation.color &&
                    "border-2 border-color-pallet-04"
                  }`}
                  style={{
                    background: `${
                      product_variation.color === "Multi"
                        ? "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)"
                        : product_variation.color
                    }`,
                  }}
                ></button>
              ))}
            </div>
          </div>
          <div className="text-text-color-dark-green font-semibold text-2xl mb-2">
            <div>Size: {selectedSize}</div>
            {product.product_variations.map((product_variation) => {
              if (product_variation.color === selectedColor) {
                return product_variation.product_size_inventory.map(
                  ({ size }) => {
                    return (
                      <button
                        key={size}
                        onClick={() => handleSetSelectedSize(size)}
                        className={`bg-color-pallet-03 min-w-14 px-2 h-14 mr-2 mb-2 hover:bg-color-pallet-02 rounded-md ${
                          selectedSize === size &&
                          "border-2 border-color-pallet-04"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  }
                );
              }
              return product_variation.product_size_inventory.map(
                ({ size }) => {
                  return (
                    <button
                      key={size}
                      disabled
                      className={`bg-gray-500 min-w-14 px-2 h-14 mr-2 mb-2 rounded-md ${
                        selectedSize === size &&
                        "border-2 border-color-pallet-04"
                      }`}
                    >
                      {size}
                    </button>
                  );
                }
              );
            })}
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
              {userData ? (
                <button
                  className="bg-color-pallet-03 hover:bg-color-pallet-04 p-2 rounded-md shadow-xl border-2 border-color-pallet-04"
                  onClick={() => handleAddToCart()}
                >
                  Add to cart
                </button>
              ) : (
                <Link
                  href={"/profile/login"}
                  className="bg-color-pallet-03 hover:bg-color-pallet-04 py-2 px-4 rounded-md shadow-md"
                >
                  Add to cart
                </Link>
              )}
            </div>
          </div>
          {messageData.message ? (
            <div
              className="text-text-color-dark-green font-semibold"
              style={{ color: `${messageData.color}` }}
            >
              {messageData.message}
            </div>
          ) : (
            <div className="p-3"></div>
          )}
          <div className="bg-color-pallet-02 border-2 border-color-pallet-04 text-text-color-dark-green font-semibold p-2 mb-2 rounded-md">
            {product.description}
          </div>
        </div>
      </div>
    </div>
  );
}
