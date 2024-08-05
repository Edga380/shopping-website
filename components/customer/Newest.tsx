"use client";

import ProductCard from "./ProductCard";
import { getNewestProducts } from "../../database/models/product/getNewestProducts";
import { useState, useEffect } from "react";
import {
  UpdatedProduct,
  NewestBestSellerProducts,
} from "../../types/databaseTypes";

export default function Newest() {
  const [products, setProducts] = useState<
    (UpdatedProduct | NewestBestSellerProducts)[]
  >([]);

  useEffect(() => {
    const fetchNewstProducts = async () => {
      try {
        const fetchedProducts = await getNewestProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Failed to fetch newest products: ", error);
        throw error;
      }
    };
    fetchNewstProducts();
  }, []);

  return (
    <>
      <div className="flex flex-col items-center">
        <h2 className="text-4xl text-text-color-dark-green font-bold">
          Newest
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.product_id} product={product}></ProductCard>
        ))}
      </div>
    </>
  );
}
