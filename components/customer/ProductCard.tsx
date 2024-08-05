"use client";

import Link from "next/link";
import Image from "next/image";
import {
  NewestBestSellerProducts,
  UpdatedProduct,
} from "../../types/databaseTypes";

type ProductCardProps = {
  product: UpdatedProduct | NewestBestSellerProducts;
};

function isUpdatedProduct(
  product: UpdatedProduct | NewestBestSellerProducts
): product is UpdatedProduct {
  return (product as UpdatedProduct).colors !== undefined;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="flex flex-col m-4 items-center rounded-2xl">
      <Link href={`/products/${product.product_id}/product`}>
        <div className="product-card h-[18vw] relative">
          <Image
            src={`/products/${product.images[0]}`}
            height={400}
            width={700}
            alt={product.name}
            className="transition-transform duration-300 transform hover:scale-110"
          />
          {isUpdatedProduct(product) && product.colors && (
            <div className="absolute bottom-10 flex bg-color-pallet-04 py-1 rounded-xl">
              {product.colors.map((color) => (
                <div
                  className="rounded-full w-6 h-6 mx-1"
                  style={{
                    background: `${
                      color === "Multi"
                        ? "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)"
                        : color
                    }`,
                  }}
                ></div>
              ))}
            </div>
          )}
          {isUpdatedProduct(product) && product.sizes && (
            <div className="absolute bottom-1 bg-color-pallet-04 p-1 rounded-lg">
              {product.sizes
                .sort((a, b) => {
                  const sizeOrder = ["XXS", "XS", "S", "M", "L", "XL", "XXL"];
                  return sizeOrder.indexOf(a) - sizeOrder.indexOf(b);
                })
                .join(" / ")}
            </div>
          )}
        </div>
      </Link>
      <p className="text-text-color-dark-green font-bold text-2xl mt-2">
        {product.name}
      </p>
      <p className="text-text-color-dark-green font-semibold text-xl">
        {`£${product.priceInPennies / 100}`}
      </p>
    </div>
  );
}
