"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import deleteProduct from "../../database/models/product/deleteProduct";
import updateAvailability from "../../database/models/product/updateAvailability";

type AdminProductDropdownMenuProps = {
  productId: number;
  productName: string;
  isAvailable: string;
  productImages: string[];
  isActive: boolean;
  onToggle: () => void;
};

export default function ProductDropdownMenu({
  productId,
  productName,
  isAvailable,
  productImages,
  isActive,
  onToggle,
}: AdminProductDropdownMenuProps) {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isActiveDeleteModal, setIsActiveDeleteModal] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onToggle();
      }
    };

    if (isActive) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isActive, onToggle]);

  const handleUpdateAvailability = async () => {
    await updateAvailability(productId, isAvailable);
    router.refresh();
  };

  const handleDeleteProduct = async () => {
    await deleteProduct(productImages, productId);
    router.refresh();
  };
  return (
    <>
      <div ref={dropdownRef}>
        <div>
          <button
            className="bg-color-pallet-03 text-lg font-bold text-text-color-dark-green my-1 px-6 rounded hover:bg-color-pallet-04 self-center"
            onClick={onToggle}
          >
            ---
          </button>
        </div>
        {isActive && (
          <div className="absolute w-36 bg-color-pallet-03 text-lg font-bold text-text-color-dark-green my-1 rounded self-center grid grid-cols-1">
            <button className="text-lg font-bold text-text-color-dark-green rounded hover:bg-color-pallet-04 self-center px-6">
              <Link href={`/admin/products/${productId}/edit`}>Edit</Link>
            </button>
            <button
              className="text-lg font-bold text-text-color-dark-green rounded hover:bg-color-pallet-04 self-center px-6"
              onClick={handleUpdateAvailability}
            >
              {isAvailable === "true" ? "Unavailable" : "Available"}
            </button>
            <button
              className="text-lg font-bold text-white rounded bg-red-500 hover:bg-red-700 self-center px-6 mt-4"
              onClick={() => {
                onToggle();
                setIsActiveDeleteModal(true);
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
      {isActiveDeleteModal && (
        <div className="absolute left-0 top-0 bg-black/[.6] w-full h-full flex justify-center items-center">
          <div className="bg-color-pallet-02 w-80 h-44 rounded-lg relative flex flex-col justify-center items-center">
            <div className="font-semibold text-lg text-center">
              Are you sure you want to delete:
            </div>
            <div className="font-bold text-xl text-center">"{productName}"</div>
            <div className="pt-6 flex justify-center space-x-4">
              <button
                className="text-lg font-bold text-white rounded bg-red-500 hover:bg-red-700 px-6"
                onClick={handleDeleteProduct}
              >
                Confirm
              </button>
              <button
                className="text-lg font-bold text-text-color-dark-green rounded bg-color-pallet-03 hover:bg-color-pallet-04 px-6"
                onClick={() => setIsActiveDeleteModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
