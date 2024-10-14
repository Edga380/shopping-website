"use client";

import { useEffect, useState } from "react";
import { getProductColors } from "../../../../types/databaseTypes";
import getColors from "../../../../database/models/product/getColors";
import editColor from "../../../../database/models/product/editColor";
import AddColor from "./AddColor";
import deleteColor from "../../../../database/models/product/deleteColor";

export default function DisplayColors() {
  const [trigger, setTrigger] = useState(0);
  const [isActiveDeleteModal, setIsActiveDeleteModal] = useState<boolean[]>([]);
  const [storedColors, setStoredColors] = useState<getProductColors[]>([]);
  const [editedColor, setEditedColor] = useState<string>("");
  const [editColorIsActive, setEditColorIsActive] = useState<boolean[]>([]);

  useEffect(() => {
    const fetchColors = async () => {
      const fetchedColors = await getColors();
      setStoredColors(fetchedColors);
      setEditColorIsActive(fetchedColors.map(() => false));
      setIsActiveDeleteModal(fetchedColors.map(() => false));
    };
    fetchColors();
  }, [trigger]);

  const validateColor = (color: string) => {
    if (typeof window === "undefined") {
      return false;
    }

    const newStyle = new Option().style;
    newStyle.color = color;
    return newStyle.color !== "";
  };

  const handleEditColor = async (id: number) => {
    if (
      editedColor.trim().length === 0 ||
      !validateColor(editedColor) ||
      storedColors.some((storedColor) => storedColor.color === editedColor)
    ) {
      return;
    }
    await editColor(id, editedColor);
    setTrigger((prev) => prev + 1);
  };

  const handleRevomeColor = async (index: number) => {
    await deleteColor(index);
    setTrigger((prev) => prev + 1);
  };

  const handleEditColorIsActive = (index: number) => {
    setEditedColor("");
    setEditColorIsActive(
      editColorIsActive.map((_, i) => (i === index ? true : false))
    );
  };

  return (
    <>
      <div className="flex flex-wrap justify-center">
        {storedColors
          .sort((a, b) => a.color.localeCompare(b.color))
          .map((storedColor, index) => (
            <div
              key={storedColor.product_color_id}
              className="bg-color-pallet-02 shadow-md w-52 pb-6 mx-2 text-2xl text-center m-2"
            >
              <div className="bg-color-pallet-03 flex justify-left items-center p-2 font-bold text-text-color-dark-green">
                <div
                  className="relative w-8 h-8 mr-6 border-1 border-black"
                  style={{
                    backgroundColor: `${storedColor.color}`,
                  }}
                ></div>
                {storedColor.color}
              </div>
              <div className="flex flex-col justify-center mt-6">
                <div>
                  <button
                    className="bg-color-pallet-03 text-lg font-bold text-text-color-dark-green px-3 py-2 rounded shadow-md mx-2 hover:bg-color-pallet-04"
                    type="button"
                    onClick={() => handleEditColorIsActive(index)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-lg font-bold text-text-color-dark-green px-3 py-2 rounded shadow-md mx-2 hover:bg-red-700"
                    type="button"
                    onClick={() =>
                      setIsActiveDeleteModal(
                        isActiveDeleteModal.map((_, i) =>
                          i === index ? true : false
                        )
                      )
                    }
                  >
                    Remove
                  </button>
                </div>
                {editColorIsActive[index] && (
                  <div>
                    <input
                      type="text"
                      id="editColor"
                      name="editColor"
                      placeholder="Edit color"
                      value={editedColor}
                      className="w-44 mt-8 p-2 rounded mx-auto text-base"
                      onChange={(event) =>
                        setEditedColor(
                          event.currentTarget.value.charAt(0).toUpperCase() +
                            event.currentTarget.value.slice(1).toLowerCase()
                        )
                      }
                    />
                    <button
                      className="bg-color-pallet-03 text-lg font-bold text-text-color-dark-green px-3 py-2 rounded shadow-md mx-1 mt-2 hover:bg-color-pallet-04"
                      type="button"
                      onClick={() =>
                        setEditColorIsActive(editColorIsActive.map(() => false))
                      }
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-color-pallet-03 text-lg font-bold text-text-color-dark-green px-3 py-2 rounded shadow-md mx-1 mt-2 hover:bg-color-pallet-04"
                      type="button"
                      onClick={() =>
                        handleEditColor(storedColor.product_color_id)
                      }
                    >
                      Submit
                    </button>
                  </div>
                )}
              </div>
              {isActiveDeleteModal[index] && (
                <div className="absolute left-0 top-0 bg-black/[.6] w-full h-full flex justify-center items-center z-10">
                  <div className="bg-color-pallet-02 w-80 h-44 rounded-lg relative flex flex-col justify-center items-center">
                    <div className="font-semibold text-lg">
                      Are you sure you want to delete
                    </div>
                    <div className="font-bold text-xl">
                      <span className="font-semibold text-lg">
                        product color:
                      </span>{" "}
                      {storedColor.color}
                    </div>
                    <div className="pt-6 flex justify-center space-x-4">
                      <button
                        className="text-lg font-bold text-white rounded bg-red-500 hover:bg-red-700 px-6 shadow-md"
                        onClick={() =>
                          handleRevomeColor(storedColor.product_color_id)
                        }
                      >
                        Confirm
                      </button>
                      <button
                        className="text-lg font-bold text-text-color-dark-green rounded bg-color-pallet-03 hover:bg-color-pallet-04 px-6 shadow-md"
                        onClick={() =>
                          setIsActiveDeleteModal(
                            isActiveDeleteModal.map(() => false)
                          )
                        }
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
      <AddColor
        setTrigger={setTrigger}
        storedColors={storedColors}
        validateColor={validateColor}
      />
    </>
  );
}
