"use client";

import React, { useEffect, useState, useRef } from "react";
import updateProduct from "../../database/models/product/updateProduct";
import { formatCurrency } from "../../utils/formatters";
import { UpdatedProduct } from "../../types/databaseTypes";
import { useRouter } from "next/navigation";

export default function EditProductFrom({
  product,
}: {
  product: UpdatedProduct;
}) {
  const [priceInPennies, setPriceInPennies] = useState<number>(
    product.priceInPennies || 0
  );
  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const fileInputReference = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const addSelectedData = () => {
      if (product === null) return;
      setSelectedColors([...product.colors]);
      setSelectedSizes([...product.sizes]);
      setExistingImages([...product.images]);
    };
    addSelectedData();
  }, []);

  const colors = [
    "Black",
    "White",
    "Grey",
    "Blue",
    "Brown",
    "Khaki",
    "Green",
    "Purple",
    "Yellow",
    "Red",
    "Pink",
    "Orange",
    "Multi",
  ];

  const sizes = ["XXS", "XS", "S", "M", "L", "XL", "XXL"];

  const handleSelectedColors = (color: string) => {
    if (!selectedColors.some((selectedColor) => selectedColor === color)) {
      setSelectedColors([...selectedColors, color]);
    } else {
      setSelectedColors(
        selectedColors.filter((selectedColor) => selectedColor !== color)
      );
    }
  };

  const handleSelectedSizes = (size: string) => {
    if (!selectedSizes.some((selectedSize) => selectedSize === size)) {
      setSelectedSizes([...selectedSizes, size]);
    } else {
      setSelectedSizes(
        selectedSizes.filter((selectedSize) => selectedSize !== size)
      );
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImage = Array.from(files);

      const duplicateNewImages = newImages.some((image) =>
        image.name.includes(newImage[0].name)
      );

      const duplicateExistingImages = existingImages.some((image) =>
        image.includes(newImage[0].name)
      );

      if (duplicateNewImages || duplicateExistingImages) {
        alert(
          `Images with the same name are not allowed: "${newImage[0].name}"`
        );
      } else {
        setNewImages([...newImages, ...newImage]);
      }
      if (fileInputReference.current) {
        fileInputReference.current.value = "";
      }
    }
  };

  const handleRemoveExistingImage = (indexToRemove: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== indexToRemove));
  };

  const handleRemoveNewImage = (indexToRemove: number) => {
    setNewImages(newImages.filter((_, i) => i !== indexToRemove));
  };

  const handleFormSumbit = async (
    event: React.ChangeEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("productId", product.product_id.toString());

    formData.append(
      "name",
      (event.currentTarget.querySelector("#name") as HTMLInputElement).value
    );
    formData.append(
      "description",
      (event.currentTarget.querySelector("#description") as HTMLInputElement)
        .value
    );
    formData.append(
      "category",
      (event.currentTarget.querySelector("#category") as HTMLInputElement).value
    );
    formData.append(
      "priceInPennies",
      (event.currentTarget.querySelector("#priceInPennies") as HTMLInputElement)
        .value
    );
    formData.append(
      "stock",
      (event.currentTarget.querySelector("#stock") as HTMLInputElement).value
    );
    formData.append(
      "sold",
      (event.currentTarget.querySelector("#sold") as HTMLInputElement).value
    );
    formData.append(
      "gender",
      (event.currentTarget.querySelector("#gender") as HTMLInputElement).value
    );

    formData.append("colorsCount", selectedColors.length.toString() as string);

    selectedColors.forEach((color, i) => {
      formData.append(`color_${i}`, color);
    });

    formData.append("sizesCount", selectedSizes.length.toString() as string);

    selectedSizes.forEach((size, i) => {
      formData.append(`size_${i}`, size);
    });

    formData.append(
      "available",
      (event.currentTarget.querySelector("#available") as HTMLInputElement)
        .checked
        ? "true"
        : "false"
    );

    formData.append(
      "existingImagesCount",
      existingImages.length.toString() as string
    );

    existingImages.forEach((image, i) => {
      formData.append(`existing_image_${i}`, image);
    });

    formData.append("newImagesCount", newImages.length.toString() as string);

    newImages.forEach((image, i) => {
      formData.append(`new_image_${i}`, image);
    });

    await updateProduct(formData);

    window.location.href = "/admin/products";
  };

  return (
    <form onSubmit={handleFormSumbit}>
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
          defaultValue={product.name}
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
          cols={62}
          rows={6}
          className="resize-none p-2 rounded"
          placeholder="Product description"
          defaultValue={product.description}
          required
        ></textarea>

        <label
          htmlFor="category"
          className="text-lg font-bold text-text-color-dark-green py-2"
        >
          Category
        </label>
        <select
          id="category"
          name="category"
          className="resize-none p-2 rounded"
          defaultValue={product.category}
        >
          <option value="other">Other</option>
          <option value="tshirt">T-shirt</option>
          <option value="jumper">Jumper</option>
          <option value="pants">Pants</option>
          <option value="socks">Socks</option>
        </select>

        <label
          htmlFor="priceInPennies"
          className="text-lg font-bold text-text-color-dark-green py-2"
        >
          Price in Pennies
        </label>
        <input
          type="number"
          id="priceInPennies"
          name="priceInPennies"
          placeholder="0"
          className="p-2 rounded"
          defaultValue={product.priceInPennies}
          onChange={(v) => setPriceInPennies(Number(v.target.value))}
          required
        />
        <div className="py-2 pl-2 mt-2 w-auto bg-color-pallet-03 rounded">
          {formatCurrency(Number(priceInPennies))}
        </div>

        <label
          htmlFor="stock"
          className="text-lg font-bold text-text-color-dark-green py-2"
        >
          Units
        </label>
        <input
          type="number"
          id="stock"
          name="stock"
          className="p-2 rounded"
          placeholder="0"
          defaultValue={product.stock}
          required
        />

        <label
          htmlFor="sold"
          className="text-lg font-bold text-text-color-dark-green py-2"
        >
          Sold
        </label>
        <input
          type="number"
          id="sold"
          name="sold"
          className="p-2 rounded"
          placeholder="0"
          defaultValue={product.sold}
          required
        />

        <label
          htmlFor="gender"
          className="text-lg font-bold text-text-color-dark-green py-2"
        >
          Gender
        </label>
        <select
          id="gender"
          name="gender"
          className="resize-none p-2 rounded"
          defaultValue={product.gender}
        >
          <option value="unisex">Unisex</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
        </select>

        <label
          htmlFor="colors"
          className="text-lg font-bold text-text-color-dark-green py-2"
        >
          Colors
        </label>
        <div className="flex flex-wrap">
          {colors.map((color) => (
            <div className="m-2 flex flex-col items-center" key={color}>
              <div
                className="w-10 h-10 rounded"
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
                className="w-6 h-6"
                onChange={() => handleSelectedColors(color)}
                defaultChecked={product.colors.includes(color)}
              />
            </div>
          ))}
        </div>

        <label
          htmlFor="size"
          className="text-lg font-bold text-text-color-dark-green py-2"
        >
          Sizes
        </label>
        <div className="flex flex-wrap">
          {sizes.map((size) => (
            <div className="m-2 flex flex-col items-center" key={size}>
              <div>{size}</div>
              <input
                type="checkbox"
                id="size"
                name="size"
                className="w-6 h-6"
                onChange={() => handleSelectedSizes(size)}
                defaultChecked={product.sizes.includes(size)}
              />
            </div>
          ))}
        </div>

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
          onChange={handleImageChange}
          ref={fileInputReference}
          multiple
          required={product == null}
        />
        <>
          <div className="text-lg font-bold text-text-color-dark-green py-2">
            Current product images:
          </div>
          <div className="grid grid-cols-3 py-2">
            {existingImages.map((image, i) => (
              <div key={i} className="flex flex-col relative">
                <img
                  key={i}
                  src={`/products/${image}`}
                  alt={`Existing Image ${image}`}
                  width={200}
                  height={60}
                  className="m-auto w-52 h-48"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveExistingImage(i)}
                  className="bg-color-pallet-03 text-lg font-bold text-text-color-dark-green my-4 px-3 py-2 rounded hover:bg-color-pallet-04 m-auto"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          {newImages.length > 0 ? (
            <div className="text-lg font-bold text-text-color-dark-green py-2">
              New product images:
            </div>
          ) : (
            <div className="text-lg font-bold text-text-color-dark-green py-2">
              No new product images.
            </div>
          )}
          <div className="grid grid-cols-3 py-2">
            {newImages.map((image, i) => (
              <div key={i} className="flex flex-col relative">
                <img
                  key={i}
                  src={URL.createObjectURL(image)}
                  alt={`Selected Image ${image.name}`}
                  width={200}
                  height={60}
                  className="m-auto w-52 h-48"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveNewImage(i)}
                  className="bg-color-pallet-03 text-lg font-bold text-text-color-dark-green my-4 px-3 py-2 rounded hover:bg-color-pallet-04 m-auto"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </>

        <label
          htmlFor="available"
          className="text-lg font-bold text-text-color-dark-green py-2"
        >
          Available to purchase?
        </label>
        <input
          type="checkbox"
          id="available"
          name="available"
          className="w-6 h-6"
          defaultChecked={
            product.isAvailable ? JSON.parse(product.isAvailable) : false
          }
        />
        <button
          className="bg-color-pallet-03 text-lg font-bold text-text-color-dark-green my-4 px-3 py-2 rounded hover:bg-color-pallet-04"
          type="submit"
        >
          Save
        </button>
      </div>
    </form>
  );
}
