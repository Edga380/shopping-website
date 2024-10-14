"use client";

import React, { useState, Dispatch, SetStateAction } from "react";
import addSize from "../../../../database/models/product/addSize";
import {
  getProductCategories,
  getProductSizes,
} from "../../../../types/databaseTypes";

export default function AddSize({
  productCategories,
  setTrigger,
  storedSizes,
}: {
  productCategories: getProductCategories[];
  setTrigger: Dispatch<SetStateAction<number>>;
  storedSizes: getProductSizes[];
}) {
  const [newSize, setNewSize] = useState<string>("");
  const [category, setCategory] = useState<string>(
    productCategories[0].category
  );
  const [messageData, setMessageData] = useState<{
    message: string;
    color: string;
  }>({ message: "", color: "" });

  const handleAddSize = async () => {
    if (
      storedSizes.some(
        (storedSize) =>
          storedSize.size === newSize &&
          storedSize.categories.includes(category)
      ) ||
      newSize.trim().length === 0
    ) {
      if (newSize.trim().length === 0) {
        setMessageData({
          message: `Input can't be empty.`,
          color: "red",
        });
        return;
      }
      setMessageData({
        message: `Size "${newSize}" already exist.`,
        color: "red",
      });
      return;
    }
    try {
      await addSize(newSize, category);
      setMessageData({
        message: `Size "${newSize}" added successfully.`,
        color: "green",
      });
      setNewSize("");
      setTrigger((prev) => prev + 1);
    } catch (error) {
      setMessageData({
        message: `Something went wrong. Could not add "${newSize}" size.`,
        color: "red",
      });
      throw error;
    }
  };
  return (
    <div className="flex flex-col bg-color-pallet-02 w-96 rounded mt-2 mx-auto shadow-md">
      <div className="bg-color-pallet-03 text-center text-lg font-bold text-text-color-dark-green py-2 mx-auto w-full">
        Add size
      </div>
      {messageData.message ? (
        <div
          className="font-bold text-text-color-dark-green mx-auto text-center"
          style={{ color: `${messageData.color}` }}
        >
          {messageData.message}
        </div>
      ) : (
        <div className="p-3"></div>
      )}
      <div className="flex flex-col justify-center items-center">
        <select
          id="category"
          name="category"
          className="p-2 my-2 mx-auto rounded resize-none"
          onChange={(event) => setCategory(event.currentTarget.value)}
        >
          {productCategories.map(({ category }) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <input
          type="text"
          id="addSize"
          name="addSize"
          placeholder="Add size"
          value={newSize}
          className="p-2 rounded"
          onChange={(event) =>
            setNewSize(event.currentTarget.value.toUpperCase())
          }
        />
      </div>
      <button
        className="bg-color-pallet-03 text-lg font-bold text-text-color-dark-green px-3 py-2 rounded shadow-md mx-auto my-2 hover:bg-color-pallet-04"
        type="button"
        onClick={handleAddSize}
      >
        Submit
      </button>
    </div>
  );
}
