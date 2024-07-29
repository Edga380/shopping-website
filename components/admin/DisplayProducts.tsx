"use client";

import ProductDropdownMenu from "./ProductDropDownMenu";
import { formatCurrency } from "../../utils/formatters";
import { UpdatedProduct } from "../../types/databaseTypes";

export default function DisplayProducts({
  products,
}: {
  products: UpdatedProduct[];
}) {
  return (
    <>
      {products.map((product, index) => (
        <div
          key={index}
          className="grid grid-cols-9 mt-2 px-2 bg-color-pallet-02 text-text-color-dark-green rounded-lg border-2 border-color-pallet-03"
        >
          <div className="px-2 self-center">{product.name}</div>
          <div className="px-2 self-center">{product.description}</div>
          <div className="px-2 self-center">{product.category}</div>
          <div className="px-2 self-center">
            {formatCurrency(Number(product.priceInPennies))}
          </div>
          <div className="px-2 self-center">{product.stock}</div>
          <div className="px-2 self-center">{product.sold}</div>
          <div className="px-2 self-center">
            {product.isAvailable === "true" ? (
              <div className="bg-green-600 rounded-full w-4 h-4"></div>
            ) : (
              <div className="bg-red-600 rounded-full w-4 h-4"></div>
            )}
          </div>
          <div className="px-2 self-center">
            {product.created_at.slice(0, 10)}
          </div>
          <ProductDropdownMenu
            productId={product.product_id}
            isAvailable={product.isAvailable}
            productImages={product.images}
          ></ProductDropdownMenu>
        </div>
      ))}
    </>
  );
}
