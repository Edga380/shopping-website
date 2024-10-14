"use client";

import React, { useState, Dispatch, SetStateAction } from "react";
import addCategory from "../../../../database/models/product/addCategory";
import { getProductCategories } from "../../../../types/databaseTypes";

export default function AddCategory({
  setTrigger,
  storedCategories,
}: {
  setTrigger: Dispatch<SetStateAction<number>>;
  storedCategories: getProductCategories[];
}) {
  const [newCategory, setNewCategory] = useState<string>("");
  const [messageData, setMessageData] = useState<{
    message: string;
    color: string;
  }>({ message: "", color: "" });

  const handleAddCategory = async () => {
    if (
      newCategory.trim().length === 0 ||
      storedCategories.some(
        (storedCategory) => storedCategory.category === newCategory
      )
    ) {
      setMessageData({
        message: `Category "${newCategory}" already exist.`,
        color: "red",
      });
      return;
    }

    try {
      await addCategory(newCategory);
      setMessageData({
        message: `Category "${newCategory}" added successfully.`,
        color: "green",
      });
      setNewCategory("");
      setTrigger((prev) => prev + 1);
    } catch (error) {
      setMessageData({
        message: `Something went wrong. Could not add "${newCategory}" category.`,
        color: "red",
      });
      throw error;
    }
  };
  return (
    <div className="flex flex-col bg-color-pallet-02 w-96 rounded mt-2 mx-auto shadow-md">
      <div className="bg-color-pallet-03 text-center text-lg font-bold text-text-color-dark-green py-2 mx-auto w-full">
        Add category
      </div>
      {messageData.message ? (
        <div
          className="font-bold text-text-color-dark-green mx-auto"
          style={{ color: `${messageData.color}` }}
        >
          {messageData.message}
        </div>
      ) : (
        <div className="p-3"></div>
      )}
      <input
        type="text"
        id="addCategory"
        name="addCategory"
        placeholder="Add category"
        value={newCategory}
        className="p-2 rounded mx-auto"
        onChange={(event) =>
          setNewCategory(
            event.currentTarget.value.charAt(0).toUpperCase() +
              event.currentTarget.value.slice(1).toLowerCase()
          )
        }
      />
      <button
        className="bg-color-pallet-03 text-lg font-bold text-text-color-dark-green px-3 py-2 rounded shadow-md mx-auto my-2 hover:bg-color-pallet-04"
        type="button"
        onClick={handleAddCategory}
      >
        Submit
      </button>
    </div>
  );
}
