"use client";

import ProductCard from "./ProductCard";
import { UpdatedProduct } from "../../types/databaseTypes";

export default function Newest({
  newestProducts,
}: {
  newestProducts: UpdatedProduct[];
}) {
  return (
    <>
      <div className="flex flex-col items-center">
        <h2 className="text-4xl text-text-color-dark-green font-bold">
          Newest
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {newestProducts.map((newestProduct) => (
          <ProductCard
            key={newestProduct.product_id}
            product={newestProduct}
          ></ProductCard>
        ))}
      </div>
    </>
  );
}
