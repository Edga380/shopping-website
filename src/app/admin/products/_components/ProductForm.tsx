"use client";

import { useState } from "react";
import { addProduct } from "../../_actions/products";

export default function AdminProductFrom() {
  const [formatCurrency, setFormatCurrency] = useState<number>(0);
  return (
    <form action={addProduct}>
      <div className="flex flex-col">
        <label
          htmlFor="name"
          className="text-lg font-bold text-text-color-dark-green py-2"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Product name"
          className="p-2 rounded"
          required
        />

        <label
          htmlFor="description"
          className="text-lg font-bold text-text-color-dark-green py-2"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          cols={60}
          rows={6}
          className="resize-none p-2 rounded"
          placeholder="Product description"
        ></textarea>

        <label
          htmlFor="priceInCents"
          className="text-lg font-bold text-text-color-dark-green py-2"
        >
          Price in Cents
        </label>
        <input
          type="number"
          id="priceInCents"
          name="priceInCents"
          placeholder="0"
          className="p-2 rounded"
          onChange={(v) => setFormatCurrency(Number(v.target.value))}
          required
        />
        <div className="py-2 pl-2 mt-2 w-auto bg-color-pallet-03 rounded">
          {formatCurrency}
        </div>

        <label
          htmlFor="units"
          className="text-lg font-bold text-text-color-dark-green py-2"
        >
          Units
        </label>
        <input
          type="number"
          id="units"
          name="units"
          className="p-2 rounded"
          placeholder="0"
          required
        />

        <label
          htmlFor="image"
          className="text-lg font-bold text-text-color-dark-green py-2"
        >
          Image
        </label>
        <input
          type="file"
          id="image"
          name="image"
          className="text-text-color-dark-green py-2 pl-2 mt-2 bg-color-pallet-03 rounded"
          required
        />

        <label
          htmlFor="available"
          className="text-lg font-bold text-text-color-dark-green py-2"
        >
          Available to buy?
        </label>
        <input
          type="checkbox"
          id="available"
          name="available"
          className="w-6 h-6"
        />

        <button
          type="submit"
          className="bg-color-pallet-03 text-lg font-bold text-text-color-dark-green my-4 px-3 py-2 rounded hover:bg-color-pallet-04"
        >
          Save
        </button>
      </div>
    </form>
  );
}
