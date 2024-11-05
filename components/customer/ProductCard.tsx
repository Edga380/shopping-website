"use client";

import Link from "next/link";
import Image from "next/image";
import { UpdatedProduct } from "../../types/databaseTypes";

export default function ProductCard({ product }: { product: UpdatedProduct }) {
  return (
    <div className="flex flex-col m-4 items-center rounded-2xl">
      <Link href={`/products/${product.product_id}/product`}>
        <div className="product-card h-[18vw] relative">
          <Image
            src={
              product.product_variations[0].images.length === 0
                ? `/notFoundImages/product_not_found.svg`
                : `${product.product_variations[0].images[0]}`
            }
            height={700}
            width={400}
            alt={product.name}
            className="transition-transform duration-300 transform hover:scale-110"
          />
          {product.product_variations.length > 0 && (
            <div className="absolute bottom-5 flex bg-color-pallet-04 py-1 rounded-xl">
              {product.product_variations.map(({ color }) => (
                <div
                  key={color}
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
        </div>
      </Link>
      <p className="text-text-color-dark-green font-bold text-2xl mt-2">
        {product.name}
      </p>
      <p className="text-text-color-dark-green font-semibold text-xl">
        {`£${product.base_price_in_pennies / 100}`}
      </p>
    </div>
  );
}
