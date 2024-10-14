"use client";

import { useEffect, useState } from "react";
import {
  getProductCategories,
  getProductSizes,
} from "../../../../types/databaseTypes";
import getSizes from "../../../../database/models/product/getSizes";
import editSize from "../../../../database/models/product/editSize";
import AddSize from "./AddSize";
import deleteSize from "../../../../database/models/product/deleteSize";

export default function DisplaySizes({
  productCategories,
}: {
  productCategories: getProductCategories[];
}) {
  const [trigger, setTrigger] = useState(0);
  const [isActiveDeleteModal, setIsActiveDeleteModal] = useState<number | null>(
    null
  );
  const [storedSizes, setStoredSizes] = useState<getProductSizes[]>([]);
  const [editedSize, setEditedSize] = useState<string>("");
  const [editSizeIndex, setEditSizeIndex] = useState<number | null>(null);
  const [messageData, setMessageData] = useState<{
    message: string;
    color: string;
  }>({ message: "", color: "" });

  useEffect(() => {
    const fetchSizes = async () => {
      const fetchedSizes = await getSizes();
      setStoredSizes(fetchedSizes);
    };
    fetchSizes();
  }, [trigger]);

  const handleEditSize = async (id: number) => {
    if (
      storedSizes.some((storedSize) => storedSize.size === editedSize) ||
      editedSize.trim().length === 0
    ) {
      if (editedSize.trim().length === 0) {
        setMessageData({
          message: `Input can't be empty.`,
          color: "red",
        });
        return;
      }
      setMessageData({
        message: `Size "${editedSize}" already exist.`,
        color: "red",
      });
      return;
    }
    await editSize(id, editedSize);
    setEditedSize("");
    setEditSizeIndex(null);
    setMessageData({
      message: "",
      color: "green",
    });
    setTrigger((prev) => prev + 1);
  };

  const handleRevomeSize = async (index: number, category: string) => {
    await deleteSize(index, category);
    setTrigger((prev) => prev + 1);
  };

  const handleEditSizeIsActive = (index: number) => {
    setEditedSize("");
    setEditSizeIndex(index);
  };

  return (
    <>
      {productCategories
        .sort((a, b) => a.category.localeCompare(b.category))
        .map(({ category }, categoryIndex) => (
          <div
            key={`${category}-${categoryIndex}`}
            className="items-center mt-2 mx-2 px-2 bg-color-pallet-02 text-text-color-dark-green text-2xl font-semibold shadow-md"
          >
            {category}
            <div className="flex flex-wrap justify-center">
              {storedSizes.filter((storedSize) =>
                storedSize.categories.includes(category)
              ).length > 0 ? (
                storedSizes
                  .filter((storedSize) =>
                    storedSize.categories.includes(category)
                  )
                  .map((storedSize, sizeIndex) => (
                    <div
                      key={storedSize.product_size_id}
                      className="bg-color-pallet-02 shadow-md w-52 pb-6 mx-2 text-2xl text-center m-2"
                    >
                      <div className="bg-color-pallet-03 p-2 font-bold text-text-color-dark-green">
                        {storedSize.size}
                      </div>
                      <div className="flex flex-col justify-center mt-6">
                        <div>
                          <button
                            className="bg-color-pallet-03 text-lg font-bold text-text-color-dark-green px-3 py-2 rounded shadow-md mx-2 hover:bg-color-pallet-04"
                            type="button"
                            onClick={() => handleEditSizeIsActive(sizeIndex)}
                          >
                            Edit
                          </button>
                          <button
                            className="bg-red-500 text-lg font-bold text-text-color-dark-green px-3 py-2 rounded shadow-md mx-2 hover:bg-red-700"
                            type="button"
                            onClick={() =>
                              setIsActiveDeleteModal(storedSize.product_size_id)
                            }
                          >
                            Remove
                          </button>
                        </div>
                        {editSizeIndex === sizeIndex && (
                          <div>
                            {messageData.message ? (
                              <div
                                className="font-bold text-text-color-dark-green mx-auto text-sm mt-3"
                                style={{ color: `${messageData.color}` }}
                              >
                                {messageData.message}
                              </div>
                            ) : (
                              <div className="p-4"></div>
                            )}
                            <input
                              type="text"
                              id="editSize"
                              name="editSize"
                              placeholder="Edit size"
                              value={editedSize}
                              className="w-44 mt-2 p-2 rounded mx-auto text-base"
                              onChange={(event) =>
                                setEditedSize(
                                  event.currentTarget.value.toUpperCase()
                                )
                              }
                            />
                            <button
                              className="bg-color-pallet-03 text-lg font-bold text-text-color-dark-green px-3 py-2 rounded shadow-md mx-1 mt-2 hover:bg-color-pallet-04"
                              type="button"
                              onClick={() => setEditSizeIndex(null)}
                            >
                              Cancel
                            </button>
                            <button
                              className="bg-color-pallet-03 text-lg font-bold text-text-color-dark-green px-3 py-2 rounded shadow-md mx-1 mt-2 hover:bg-color-pallet-04"
                              type="button"
                              onClick={() =>
                                handleEditSize(storedSize.product_size_id)
                              }
                            >
                              Submit
                            </button>
                          </div>
                        )}
                      </div>
                      {isActiveDeleteModal === storedSize.product_size_id && (
                        <div className="absolute left-0 top-0 bg-black/[.6] w-full h-full flex justify-center items-center z-10">
                          <div className="bg-color-pallet-02 w-80 h-44 rounded-lg relative flex flex-col justify-center items-center">
                            <div className="font-semibold text-lg">
                              Are you sure you want to delete
                            </div>
                            <div className="font-bold text-xl">
                              <span className="font-semibold text-lg">
                                product size:
                              </span>{" "}
                              {storedSize.size}
                            </div>
                            <div className="pt-6 flex justify-center space-x-4">
                              <button
                                className="text-lg font-bold text-white rounded bg-red-500 hover:bg-red-700 px-6 shadow-md"
                                onClick={() =>
                                  handleRevomeSize(
                                    storedSize.product_size_id,
                                    category
                                  )
                                }
                              >
                                Confirm
                              </button>
                              <button
                                className="text-lg font-bold text-text-color-dark-green rounded bg-color-pallet-03 hover:bg-color-pallet-04 px-6 shadow-md"
                                onClick={() => setIsActiveDeleteModal(null)}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
              ) : (
                <div className="text-xl p-2">No sizes.</div>
              )}
            </div>
          </div>
        ))}
      <AddSize
        productCategories={productCategories}
        setTrigger={setTrigger}
        storedSizes={storedSizes}
      />
    </>
  );
}
