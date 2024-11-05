"use client";

import { useEffect, useState } from "react";
import { getProductCategories } from "../../../../types/databaseTypes";
import getCategories from "../../../../database/models/product/getCategories";
import editCategory from "../../../../database/models/product/editCategory";
import AddCategory from "./AddCategory";
import deleteCategory from "../../../../database/models/product/deleteCategory";
import DeleteModal from "../../../DeleteModal";

export default function DisplayCategories() {
  const [trigger, setTrigger] = useState(0);
  const [isActiveDeleteModal, setIsActiveDeleteModal] = useState<
    number | undefined
  >(undefined);
  const [storedCategories, setStoredCategories] = useState<
    getProductCategories[]
  >([]);
  const [editedCategory, setEditedCategory] = useState<string>("");
  const [editCategoryIsActive, setEditCategoryIsActive] = useState<
    number | undefined
  >(undefined);

  useEffect(() => {
    const fetchCategories = async () => {
      const fetchedCategories = await getCategories();
      setStoredCategories(fetchedCategories);
      setEditCategoryIsActive(undefined);
      setIsActiveDeleteModal(undefined);
    };
    fetchCategories();
  }, [trigger]);

  const handleEditCategory = async (id: number) => {
    if (editedCategory.trim().length === 0) return;
    await editCategory(id, editedCategory);
    setTrigger((prev) => prev + 1);
  };

  const handleRevomeCategory = async (id: number) => {
    await deleteCategory(id);
    setTrigger((prev) => prev + 1);
  };

  const handleEditCategoryIsActive = (id: number) => {
    setEditedCategory("");
    if (editCategoryIsActive) {
      setEditCategoryIsActive(undefined);
    } else {
      setEditCategoryIsActive(id);
    }
  };

  return (
    <>
      <div className="flex flex-wrap justify-center">
        {storedCategories
          .sort((a, b) => a.category.localeCompare(b.category))
          .map((storedCategory) => (
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
                    onClick={() =>
                      handleEditCategoryIsActive(
                        storedCategory.product_category_id
                      )
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-lg font-bold text-text-color-dark-green px-3 py-2 rounded shadow-md mx-2 hover:bg-red-700"
                    type="button"
                    onClick={() =>
                      setIsActiveDeleteModal(storedCategory.product_category_id)
                    }
                  >
                    Remove
                  </button>
                </div>
                {editCategoryIsActive ===
                  storedCategory.product_category_id && (
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
                        handleEditCategoryIsActive(
                          storedCategory.product_category_id
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
              <DeleteModal
                currentId={isActiveDeleteModal}
                elementId={storedCategory.product_category_id}
                message={"product category"}
                name={storedCategory.category}
                handleDelete={handleRevomeCategory}
                setDeleteModal={setIsActiveDeleteModal}
              />
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
