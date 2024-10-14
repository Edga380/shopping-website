"use client";

import { useEffect, useState } from "react";
import { getProductCategories } from "../../../../types/databaseTypes";
import getCategories from "../../../../database/models/product/getCategories";
import editCategory from "../../../../database/models/product/editCategory";
import AddCategory from "./AddCategory";
import deleteCategory from "../../../../database/models/product/deleteCategory";

export default function DisplayCategories() {
  const [trigger, setTrigger] = useState(0);
  const [isActiveDeleteModal, setIsActiveDeleteModal] = useState<boolean[]>([]);
  const [storedCategories, setStoredCategories] = useState<
    getProductCategories[]
  >([]);
  const [editedCategory, setEditedCategory] = useState<string>("");
  const [editCategoryIsActive, setEditCategoryIsActive] = useState<boolean[]>(
    []
  );

  useEffect(() => {
    const fetchCategories = async () => {
      const fetchedCategories = await getCategories();
      setStoredCategories(fetchedCategories);
      setEditCategoryIsActive(fetchedCategories.map(() => false));
      setIsActiveDeleteModal(fetchedCategories.map(() => false));
    };
    fetchCategories();
  }, [trigger]);

  const handleEditCategory = async (id: number) => {
    if (editedCategory.trim().length === 0) return;
    await editCategory(id, editedCategory);
    setTrigger((prev) => prev + 1);
  };

  const handleRevomeCategory = async (index: number) => {
    await deleteCategory(index);
    setTrigger((prev) => prev + 1);
  };

  const handleEditCategoryIsActive = (index: number) => {
    setEditedCategory("");
    setEditCategoryIsActive(
      editCategoryIsActive.map((_, i) => (i === index ? true : false))
    );
  };

  return (
    <>
      <div className="flex flex-wrap justify-center">
        {storedCategories
          .sort((a, b) => a.category.localeCompare(b.category))
          .map((storedCategory, index) => (
            <div
              key={storedCategory.product_category_id}
              className="bg-color-pallet-02 shadow-md w-52 pb-6 mx-2 text-2xl text-center m-2"
            >
              <div className="bg-color-pallet-03 p-2 font-bold text-text-color-dark-green">
                {storedCategory.category}
              </div>
              <div className="flex flex-col justify-center mt-6">
                <div>
                  <button
                    className="bg-color-pallet-03 text-lg font-bold text-text-color-dark-green px-3 py-2 rounded shadow-md mx-2 hover:bg-color-pallet-04"
                    type="button"
                    onClick={() => handleEditCategoryIsActive(index)}
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
                {editCategoryIsActive[index] && (
                  <div>
                    <input
                      type="text"
                      id="editCategory"
                      name="editCategory"
                      placeholder="Edit category"
                      value={editedCategory}
                      className="w-44 mt-8 p-2 rounded mx-auto text-base"
                      onChange={(event) =>
                        setEditedCategory(
                          event.currentTarget.value.charAt(0).toUpperCase() +
                            event.currentTarget.value.slice(1).toLowerCase()
                        )
                      }
                    />
                    <button
                      className="bg-color-pallet-03 text-lg font-bold text-text-color-dark-green px-3 py-2 rounded shadow-md mx-1 mt-2 hover:bg-color-pallet-04"
                      type="button"
                      onClick={() =>
                        setEditCategoryIsActive(
                          editCategoryIsActive.map(() => false)
                        )
                      }
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-color-pallet-03 text-lg font-bold text-text-color-dark-green px-3 py-2 rounded shadow-md mx-1 mt-2 hover:bg-color-pallet-04"
                      type="button"
                      onClick={() =>
                        handleEditCategory(storedCategory.product_category_id)
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
                        product category:
                      </span>{" "}
                      {storedCategory.category}
                    </div>
                    <div className="pt-6 flex justify-center space-x-4">
                      <button
                        className="text-lg font-bold text-white rounded bg-red-500 hover:bg-red-700 px-6 shadow-md"
                        onClick={() =>
                          handleRevomeCategory(
                            storedCategory.product_category_id
                          )
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
      <AddCategory
        setTrigger={setTrigger}
        storedCategories={storedCategories}
      />
    </>
  );
}
