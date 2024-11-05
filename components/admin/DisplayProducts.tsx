"use client";

import ProductDropdownMenu from "./ProductDropDownMenu";
import { formatCurrency } from "../../utils/formatters";
import { UpdatedProduct } from "../../types/databaseTypes";
import { useState } from "react";

export default function DisplayProducts({
  products,
}: {
  products: UpdatedProduct[];
}) {
  const [activeDropDownIndex, setActiveDropDownIndex] = useState<number | null>(
    null
  );

  const handleToggleDropDown = (index: number) => {
    setActiveDropDownIndex(index === activeDropDownIndex ? null : index);
  };

  return (
    <>
      <div className="grid grid-cols-[0.3fr_0.5fr_2fr_0.5fr_0.5fr_0.5fr_0.5fr_0.3fr_0.5fr_0.5fr] items-center mt-2 px-2 bg-color-pallet-03 text-text-color-dark-green text-lg font-semibold shadow-md">
        <div>{products.length}</div>
        <div>Name</div>
        <div>Description</div>
        <div className="mx-auto">Category</div>
        <div className="mx-auto">Base price</div>
        <div className="mx-auto">Variations</div>
        <div className="mx-auto">Total sold</div>
        <div className="mx-auto">Available</div>
        <div className="mx-auto">Date added</div>
      </div>
      {products.map((product, index) => (
        <div
          key={index}
          className="grid grid-cols-[0.3fr_0.5fr_2fr_0.5fr_0.5fr_0.5fr_0.5fr_0.3fr_0.5fr_0.5fr] items-center mt-2 px-2 bg-color-pallet-02 text-text-color-dark-green shadow-md"
        >
          <div>{product.product_id}</div>
          <div>{product.name}</div>
          <div>{product.description.slice(0, 60)}</div>
          <div className="mx-auto">{product.category}</div>
          <div className="mx-auto">
            {formatCurrency(Number(product.base_price_in_pennies))}
          </div>
          <div className="mx-auto">
            {
              product.product_variations.map((variation) => variation.color)
                .length
            }
          </div>

          <div className="mx-auto">
            {product.product_variations.reduce(
              (totalSold, productVariation) => {
                return (
                  totalSold +
                  productVariation.product_size_inventory.reduce(
                    (sizeTotalSold, sizeInventory) => {
                      return sizeTotalSold + Number(sizeInventory.sold);
                    },
                    0
                  )
                );
              },
              0
            )}
          </div>

          <div className="mx-auto">
            {product.is_available === "true" ? (
              <div className="bg-green-600 rounded-full w-4 h-4 mx-auto"></div>
            ) : (
              <div className="bg-red-600 rounded-full w-4 h-4 mx-auto"></div>
            )}
          </div>
          <div className="mx-auto">{product.created_at.slice(0, 10)}</div>
          <ProductDropdownMenu
            productId={product.product_id}
            productName={product.name}
            isAvailable={product.is_available}
            productImages={product.product_variations.flatMap(
              ({ images }) => images
            )}
            isActive={activeDropDownIndex === index}
            onToggle={() => handleToggleDropDown(index)}
          ></ProductDropdownMenu>
        </div>
      ))}
    </>
  );
}
