"use client";

import Link from "next/link";
import { useState } from "react";
import {
  UpdateProductAvailability,
  DeleteProduct,
} from "../../_actions/products";
import { useRouter } from "next/navigation";

export default function AdminProductDropdownMenu({
  productId,
  isAvailable,
}: any) {
  const router = useRouter();
  const [displayDropdownMenu, setDisplayDropdownMenu] = useState(false);

  const handleDropdownMenu = () => {
    setDisplayDropdownMenu(!displayDropdownMenu);
  };

  const handleActiveProduct = async () => {
    ("use server");
    const response = await UpdateProductAvailability(productId, isAvailable);
    if (response) {
      router.refresh();
    }
  };

  const deleteProduct = async () => {
    ("use server");
    const response = await DeleteProduct(productId);
    if (response) {
      router.refresh();
    }
  };
  return (
    <div>
      <div>
        <button
          className="bg-color-pallet-03 text-lg font-bold text-text-color-dark-green my-1 px-6 rounded hover:bg-color-pallet-04 self-center"
          onClick={handleDropdownMenu}
        >
          ---
        </button>
      </div>
      {displayDropdownMenu && (
        <div className="absolute w-36 bg-color-pallet-03 text-lg font-bold text-text-color-dark-green my-1 rounded self-center grid grid-cols-1">
          <button className="text-lg font-bold text-text-color-dark-green rounded hover:bg-color-pallet-04 self-center px-6">
            <Link href={`/admin/products/${productId}/edit`}>Edit</Link>
          </button>
          <button
            className="text-lg font-bold text-text-color-dark-green rounded hover:bg-color-pallet-04 self-center px-6"
            onClick={handleActiveProduct}
          >
            {isAvailable === "true" ? "Unavailable" : "Available"}
          </button>
          <button
            className="text-lg font-bold text-white rounded bg-red-500 hover:bg-red-700 self-center px-6 mt-4"
            onClick={deleteProduct}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
