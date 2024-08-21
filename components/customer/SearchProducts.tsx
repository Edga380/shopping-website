"use client";

import SearchProductCard from "./SearchProductCard";
import { UpdatedProduct } from "../../types/databaseTypes";

export default function SearchProducts({
  products,
  searchInput,
  toggleSearchBar,
  handleClearSearchInput,
}: {
  products: UpdatedProduct[];
  searchInput: string | null;
  toggleSearchBar: () => void;
  handleClearSearchInput: () => void;
}) {
  return (
    searchInput && (
      <div className="mt-8 bg-color-pallet-02 w-1/4 max-h-[79%] rounded-xl mx-auto p-2 pt-0 overflow-hidden z-40">
        <div className="text-text-color-dark-green mt-2 ml-4">
          Search for: "{searchInput}"
        </div>
        {products
          .filter((product) =>
            product.name
              .toLowerCase()
              .includes(searchInput?.toLowerCase() || "")
          )
          .map((filteredProduct) => (
            <SearchProductCard
              key={filteredProduct.product_id}
              product={filteredProduct}
              toggleSearchBar={toggleSearchBar}
              handleClearSearchInput={handleClearSearchInput}
            />
          ))}
      </div>
    )
  );
}
