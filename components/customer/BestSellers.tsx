"use client";

import ProductCard from "./ProductCard";
import { UpdatedProduct } from "../../types/databaseTypes";

export default function BestSellers({
  bestSellersProducts,
}: {
  bestSellersProducts: UpdatedProduct[];
}) {
  return (
    <>
      <div className="flex flex-col items-center">
        <h2 className="text-4xl text-text-color-dark-green font-bold">
          Best Sellers
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {bestSellersProducts.map((bestSellerProduct) => (
          <ProductCard
            key={bestSellerProduct.product_id}
            product={bestSellerProduct}
          ></ProductCard>
        ))}
      </div>
    </>
  );
}
