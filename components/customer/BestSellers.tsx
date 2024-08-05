"use client";

import ProductCard from "./ProductCard";
import { getBestSellerProducts } from "../../database/models/product/getBestSellerProducts";
import { useEffect, useState } from "react";
import {
  UpdatedProduct,
  NewestBestSellerProducts,
} from "../../types/databaseTypes";

export default function BestSellers() {
  const [products, setProducts] = useState<
    (UpdatedProduct | NewestBestSellerProducts)[]
  >([]);

  useEffect(() => {
    const fetchBestSellerProducts = async () => {
      try {
        const fetchedProducts = await getBestSellerProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Failed to fetch best seller products: ", error);
        throw error;
      }
    };
    fetchBestSellerProducts();
  }, []);

  return (
    <>
      <div className="flex flex-col items-center">
        <h2 className="text-4xl text-text-color-dark-green font-bold">
          Best Sellers
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
