"use client";

import React, { useState, useRef, useEffect } from "react";
import addProduct from "../../../database/models/product/addProduct";
import { formatCurrency, addDiscount } from "../../../utils/formatters";
import { Image } from "@nextui-org/react";
import getCategories from "../../../database/models/product/getCategories";
import getColors from "../../../database/models/product/getColors";
import getSizes from "../../../database/models/product/getSizes";
import { getProductSizes } from "../../../types/databaseTypes";

type selectedInventoryData = {
  color: string;
  size: string;
  stock: string;
  sold: string;
  discount: string;
};

type selectedImage = {
  color: string;
  imageFile: File;
};

export default function AddProductFrom() {
  const [messageData, setMessageData] = useState<{
    message: string;
    color: string;
  }>({ message: "", color: "" });
  const [selectColorsIsActive, setSelectColorsIsActive] =
    useState<boolean>(false);
  const [basePriceInPennies, setBasePriceInPennies] = useState<number>(0);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedInventoryData, setSelectedInventoryData] = useState<
    selectedInventoryData[]
  >([]);
  const [selectedImages, setSelectedImages] = useState<selectedImage[]>([]);
  const fileInputReference = useRef<(HTMLInputElement | null)[]>([]);
  const [existingCategories, setExistingCategories] = useState<string[]>([]);
  const [existingColors, setExistingColors] = useState<string[]>([]);
  const [existingSizes, setExistingSizes] = useState<getProductSizes[]>([]);
  const [category, setCategory] = useState<string>("");

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesData = await getCategories();
      if (categoriesData) {
        setExistingCategories(
          categoriesData.map((categoryData) => categoryData.category)
        );
        if (categoriesData.length > 0) {
          setCategory(categoriesData[0].category);
        }
      }
    };
    const fetchColors = async () => {
      const colorsData = await getColors();
      if (colorsData) {
        setExistingColors(colorsData.map((colorData) => colorData.color));
      }
    };
    const fetchSizes = async () => {
      const sizesData = await getSizes();
      if (sizesData) {
        setExistingSizes([...sizesData]);
      }
    };
    fetchCategories();
    fetchColors();
    fetchSizes();
  }, []);

  const handleSelectedColors = (colorInput: string) => {
    if (!selectedColors.some((selectedColor) => selectedColor === colorInput)) {
      setSelectedColors([...selectedColors, colorInput]);
    } else {
      setSelectedColors(
        selectedColors.filter((selectedColor) => selectedColor !== colorInput)
      );
      setSelectedInventoryData(
        selectedInventoryData.filter(
          (filterSize) => filterSize.color !== colorInput
        )
      );
    }
  };

  const handleSelectedInventoryData = (
    colorInput: string,
    sizeInput: string,
    variableInput: string,
    variable: string
  ) => {
    if (parseInt(variableInput) < 0) return;
    if (
      selectedInventoryData.some(
        (inventoryData) =>
          inventoryData.color === colorInput && inventoryData.size === sizeInput
      )
    ) {
      if (variable === "size") {
        setSelectedInventoryData(
          selectedInventoryData.filter(
            (filterSize) =>
              !(
                filterSize.color === colorInput && filterSize.size === sizeInput
              )
          )
        );
      } else {
        setSelectedInventoryData(
          selectedInventoryData.map((inventoryData) =>
            inventoryData.color === colorInput &&
            inventoryData.size === sizeInput
              ? { ...inventoryData, [variable]: variableInput }
              : inventoryData
          )
        );
      }
    } else {
      setSelectedInventoryData([
        ...selectedInventoryData,
        {
          color: colorInput,
          size: sizeInput,
          stock: "0",
          sold: "0",
          discount: "0",
        },
      ]);
    }
  };

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    colorInput: string,
    index: number
  ) => {
    const files = event.target.files;
    if (files) {
      const newImage = Array.from(files);

      const duplicateImages = selectedImages.some((selectedImage) =>
        selectedImage.imageFile.name.includes(newImage[0].name)
      );

      if (duplicateImages) {
        setMessageData({
          message: `Images with the same name are not allowed: "${newImage[0].name}"`,
          color: "red",
        });
      } else {
        setSelectedImages([
          ...selectedImages,
          { color: colorInput, imageFile: newImage[0] },
        ]);
      }
      if (fileInputReference.current[index]) {
        fileInputReference.current[index].value = "";
      }
    }
  };

  const handleRemoveNewImage = (imageName: string) => {
    setSelectedImages(
      selectedImages.filter(
        (selectedImage) => selectedImage.imageFile.name !== imageName
      )
    );
  };

  const handleOnChangeCategory = (category: string) => {
    setCategory(category);
    setSelectedInventoryData([]);
  };

  const handleFormSumbit = async (
    event: React.ChangeEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (selectedColors.length < 1) {
      setMessageData({
        message: "You must choose atleast one color.",
        color: "red",
      });
      return;
    } else if (
      !selectedColors.every((selectedColor) =>
        selectedInventoryData.some(({ color }) => color === selectedColor)
      )
    ) {
      setMessageData({
        message: "You must choose atleast one size from each color.",
        color: "red",
      });
      return;
    }

    const productFormData = new FormData();

    const inputFieldIds = [
      "name",
      "description",
      "category",
      "basePriceInPennies",
      "gender",
    ];

    inputFieldIds.forEach((inputFieldId) => {
      productFormData.append(
        inputFieldId,
        (
          event.currentTarget.querySelector(
            `#${inputFieldId}`
          ) as HTMLInputElement
        ).value
      );
    });

    productFormData.append(
      "isAvailable",
      (event.currentTarget.querySelector("#isAvailable") as HTMLInputElement)
        .checked
        ? "true"
        : "false"
    );

    productFormData.append(
      "selectedInventoryData",
      JSON.stringify(selectedInventoryData)
    );

    selectedImages.forEach((selectedImage, index) => {
      productFormData.append(
        `selectedImageFile_${index}`,
        selectedImage.imageFile
      );

      productFormData.append(
        `selectedImageColor_${index}`,
        selectedImage.color
      );
    });

    try {
      await addProduct(productFormData);
      setMessageData({
        message: `Product added successfully.`,
        color: "green",
      });
    } catch (error) {
      setMessageData({ message: `Something went wrong.`, color: "red" });
      throw error;
    }
  };

  return (
    <form
      onSubmit={handleFormSumbit}
      className="bg-color-pallet-02 mt-2 mb-48 max-w-[60rem] mx-auto shadow-md"
    >
      <div className="flex flex-col">
        <label
          htmlFor="name"
          className="bg-color-pallet-03 text-xl text-center font-bold text-text-color-dark-green p-2"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Product name"
          className="p-2 my-2 mx-auto rounded"
          required
        />

        <label
          htmlFor="description"
          className="bg-color-pallet-03 text-xl text-center font-bold text-text-color-dark-green p-2"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          cols={62}
          rows={6}
          className="p-2 my-2 mx-auto rounded resize-none"
          placeholder="Product description"
          required
        ></textarea>

        <label
          htmlFor="category"
          className="bg-color-pallet-03 text-xl text-center font-bold text-text-color-dark-green p-2"
        >
          Category
        </label>
        {existingCategories.length > 0 ? (
          <select
            id="category"
            name="category"
            className="p-2 my-2 mx-auto rounded resize-none"
            onChange={(event) =>
              handleOnChangeCategory(event.currentTarget.value)
            }
            value={category}
          >
            {existingCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        ) : (
          <div className="bg-white rounded m-2 flex justify-between mx-auto p-2">
            No found
          </div>
        )}

        <label
          htmlFor="basePriceInPennies"
          className="bg-color-pallet-03 text-xl text-center font-bold text-text-color-dark-green p-2"
        >
          Price in Pennies
        </label>
        <input
          type="number"
          id="basePriceInPennies"
          name="basePriceInPennies"
          placeholder="0"
          className="p-2 my-2 mx-auto rounded"
          value={basePriceInPennies}
          onChange={(event) =>
            setBasePriceInPennies(
              Number(event.currentTarget.value) < 0
                ? 0
                : Number(event.currentTarget.value)
            )
          }
          required
        />
        <div className="p-2 my-2 mx-auto rounded">
          {formatCurrency(Number(basePriceInPennies))}
        </div>

        <label
          htmlFor="gender"
          className="bg-color-pallet-03 text-xl text-center font-bold text-text-color-dark-green p-2"
        >
          Gender
        </label>
        <select
          id="gender"
          name="gender"
          className="p-2 my-2 mx-auto rounded resize-none"
        >
          <option value="unisex">Unisex</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
        </select>

        <label
          htmlFor="colors"
          className="bg-color-pallet-03 text-xl text-center font-bold text-text-color-dark-green p-2"
        >
          Colors
        </label>
        <button
          type="button"
          onClick={() => setSelectColorsIsActive(!selectColorsIsActive)}
          className="bg-white rounded m-2 flex justify-between mx-auto"
          disabled={existingColors.length > 0 ? false : true}
        >
          {existingColors.length > 0 ? (
            <>
              <span className="p-2">Choose colors</span>
              <span className="text-2xl">&#x2304;</span>
            </>
          ) : (
            <span className="p-2">Not found</span>
          )}
        </button>
        <div className="relative">
          {selectColorsIsActive && (
            <div className="absolute bg-white rounded border-1 border-black left-[50%] translate-x-[-50%]">
              <div className="flex flex-wrap justify-between">
                {existingColors.sort().map((color) => (
                  <div className="m-2 flex flex-col items-center" key={color}>
                    <div
                      className="w-10 h-10 rounded border-1 border-black"
                      style={{
                        background: `${
                          color === "Multi"
                            ? "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)"
                            : color
                        }`,
                      }}
                    ></div>
                    <div>{color}</div>
                    <input
                      type="checkbox"
                      id="color"
                      name="color"
                      checked={selectedColors.some(
                        (selectedColor) => selectedColor === color
                      )}
                      className="w-6 h-6"
                      onChange={() => handleSelectedColors(color)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {selectedColors.map((selectedColor, index) => (
          <div
            key={selectedColor}
            className="flex flex-col bg-white p-2 rounded border-1 border-black mb-2 text-text-color-dark-green"
          >
            <div className="grid grid-cols-[0.1fr_1fr]">
              <div className="text-center flex flex-col items-center justify-center">
                <div
                  className="w-10 h-10 rounded"
                  style={{
                    background: `${
                      selectedColor === "Multi"
                        ? "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)"
                        : selectedColor
                    }`,
                  }}
                ></div>
                {selectedColor}
              </div>
              <div>
                <div className="text-center -ml-16 text-xl">Select sizes</div>
                <div className="flex flex-wrap justify-around">
                  {existingSizes
                    .filter((existingSize) =>
                      existingSize.categories.includes(category)
                    )
                    .map((existingSize, index) => (
                      <div
                        key={`${existingSize.size}-${index}`}
                        className="flex flex-col items-center"
                      >
                        <div className="text-center">{existingSize.size}</div>
                        <input
                          type="checkbox"
                          id="size"
                          name="size"
                          className="w-6 h-6 m-2"
                          onChange={() =>
                            handleSelectedInventoryData(
                              selectedColor,
                              existingSize.size,
                              "0",
                              "size"
                            )
                          }
                        />
                        <div>Stock</div>
                        <input
                          type="number"
                          id="stock"
                          name="stock"
                          placeholder="0"
                          value={
                            selectedInventoryData.find(
                              (inventoryData) =>
                                inventoryData.color === selectedColor &&
                                inventoryData.size === existingSize.size
                            )?.stock || "0"
                          }
                          onChange={(event) =>
                            handleSelectedInventoryData(
                              selectedColor,
                              existingSize.size,
                              event.currentTarget.value,
                              "stock"
                            )
                          }
                          disabled={
                            !selectedInventoryData.some(
                              (selectedSize) =>
                                selectedSize.color === selectedColor &&
                                selectedSize.size === existingSize.size
                            )
                          }
                          className="py-2 pl-2 w-12 h-10 rounded border-1 border-black"
                        />
                        <div>Sold</div>
                        <input
                          type="number"
                          id="sold"
                          name="sold"
                          placeholder="0"
                          value={
                            selectedInventoryData.find(
                              (selectedSize) =>
                                selectedSize.color === selectedColor &&
                                selectedSize.size === existingSize.size
                            )?.sold || "0"
                          }
                          onChange={(event) =>
                            handleSelectedInventoryData(
                              selectedColor,
                              existingSize.size,
                              event.currentTarget.value,
                              "sold"
                            )
                          }
                          disabled={
                            !selectedInventoryData.some(
                              (selectedSize) =>
                                selectedSize.color === selectedColor &&
                                selectedSize.size === existingSize.size
                            )
                          }
                          className="py-2 pl-2 w-12 h-10 rounded border-1 border-black"
                        />
                        <div>Dis %</div>
                        <input
                          type="number"
                          id="discount"
                          name="discount"
                          placeholder="0"
                          value={
                            selectedInventoryData.find(
                              (selectedSize) =>
                                selectedSize.color === selectedColor &&
                                selectedSize.size === existingSize.size
                            )?.discount || "0"
                          }
                          onChange={(event) =>
                            handleSelectedInventoryData(
                              selectedColor,
                              existingSize.size,
                              event.currentTarget.value,
                              "discount"
                            )
                          }
                          disabled={
                            !selectedInventoryData.some(
                              (selectedSize) =>
                                selectedSize.color === selectedColor &&
                                selectedSize.size === existingSize.size
                            )
                          }
                          className="py-2 pl-2 w-12 h-10 rounded border-1 border-black"
                        />
                        <div>
                          {addDiscount(
                            basePriceInPennies,
                            Number(
                              selectedInventoryData.find(
                                (selectedSize) =>
                                  selectedSize.color === selectedColor &&
                                  selectedSize.size === existingSize.size
                              )?.discount
                            ) || 0
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="mx-auto text-text-color-dark-green w-full">
              <div className="flex flex-col">
                <div className="text-center mt-2 text-xl">Upload images</div>
                <input
                  type="file"
                  id="image"
                  name="image"
                  className="py-2 pl-2 mt-2 bg-color-pallet-03 rounded"
                  onChange={(event) =>
                    handleImageChange(event, selectedColor, index)
                  }
                  ref={(element) => {
                    fileInputReference.current[index] = element;
                  }}
                />
              </div>
              <div>
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-2">
                  {selectedImages.map(
                    (selectedImage) =>
                      selectedImage.color === selectedColor && (
                        <div
                          key={selectedImage.imageFile.name}
                          className="flex flex-col mx-2 items-center"
                        >
                          <Image
                            src={URL.createObjectURL(selectedImage.imageFile)}
                            height={200}
                            width={200}
                            alt={`Selected Image ${selectedImage.imageFile.name}`}
                            className="w-52 h-64 object-cover"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveNewImage(selectedImage.imageFile.name)
                            }
                            className="bg-color-pallet-03 text-lg font-bold text-text-color-dark-green my-4 px-3 py-2 rounded hover:bg-color-pallet-04 mx-auto"
                          >
                            Remove
                          </button>
                        </div>
                      )
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        <label
          htmlFor="isAvailable"
          className="bg-color-pallet-03 text-xl text-center font-bold text-text-color-dark-green p-2"
        >
          Available to purchase?
        </label>
        <input
          type="checkbox"
          id="isAvailable"
          name="isAvailable"
          className="w-8 h-8 mx-auto m-2"
        />

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
        <button
          className="bg-color-pallet-03 text-lg font-bold text-text-color-dark-green my-4 mx-auto px-3 py-2 rounded shadow-md hover:bg-color-pallet-04"
          type="submit"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
