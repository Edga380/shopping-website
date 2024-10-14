"use client";

import React, { useState, Dispatch, SetStateAction } from "react";
import addColor from "../../../../database/models/product/addColor";
import { getProductColors } from "../../../../types/databaseTypes";

export default function AddColor({
  setTrigger,
  storedColors,
  validateColor,
}: {
  setTrigger: Dispatch<SetStateAction<number>>;
  storedColors: getProductColors[];
  validateColor: (color: string) => boolean;
}) {
  const [newColor, setNewColor] = useState<string>("");
  const [messageData, setMessageData] = useState<{
    message: string;
    color: string;
  }>({ message: "", color: "" });

  const handleAddColor = async () => {
    if (
      newColor.trim().length === 0 ||
      storedColors.some(
        (storedColor) =>
          storedColor.color === newColor || !validateColor(newColor)
      )
    ) {
      if (!validateColor(newColor)) {
        setMessageData({
          message: `"${newColor}" is not a color.`,
          color: "red",
        });
        return;
      }
      setMessageData({
        message: `Color "${newColor}" already exist.`,
        color: "red",
      });
      return;
    }

    try {
      await addColor(newColor);
      setMessageData({
        message: `Color "${newColor}" added successfully.`,
        color: "green",
      });
      setNewColor("");
      setTrigger((prev) => prev + 1);
    } catch (error) {
      setMessageData({
        message: `Something went wrong. Could not add "${newColor}" color.`,
        color: "red",
      });
      throw error;
    }
  };
  return (
    <div className="flex flex-col bg-color-pallet-02 w-96 rounded mt-2 mx-auto shadow-md">
      <div className="bg-color-pallet-03 text-center text-lg font-bold text-text-color-dark-green py-2 mx-auto w-full">
        Add color
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
      <div className="flex justify-center items-center">
        <div
          className="relative w-8 h-8 mr-2 border-1 border-black"
          style={{
            backgroundColor: validateColor(newColor) ? `${newColor}` : "white",
          }}
        >
          {!validateColor(newColor) && (
            <>
              <div className="absolute bg-black w-[2.7rem] h-[1px] rotate-45 top-[0.9rem] -left-[0.37rem]"></div>
              <div className="absolute bg-black w-[2.7rem] h-[1px] -rotate-45 top-[0.9rem] -left-[0.37rem]"></div>
            </>
          )}
        </div>
        <input
          type="text"
          id="addColor"
          name="addColor"
          placeholder="Add color"
          value={newColor}
          className="p-2 rounded"
          onChange={(event) =>
            setNewColor(
              event.currentTarget.value.charAt(0).toUpperCase() +
                event.currentTarget.value.slice(1).toLowerCase()
            )
          }
        />
      </div>
      <button
        className="bg-color-pallet-03 text-lg font-bold text-text-color-dark-green px-3 py-2 rounded shadow-md mx-auto my-2 hover:bg-color-pallet-04"
        type="button"
        onClick={handleAddColor}
      >
        Submit
      </button>
    </div>
  );
}
