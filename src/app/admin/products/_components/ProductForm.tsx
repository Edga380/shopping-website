"use client";

import { useState } from "react";
import {
  addProduct,
  updateProduct,
  RemoveProductImage,
} from "../../_actions/products";
import { formatCurrency } from "@/utils/formatters";
import { useRouter } from "next/navigation";

export default function AdminProductFrom({ product }: { product?: any }) {
  console.log(product);
  const router = useRouter();
  const [productData, productImages] = product || [];
  const [priceInPennies, setPriceInPennies] = useState<number>(
    productData?.priceInPennies || 0
  );
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [serverResponse, setServerResponse] = useState("");
  const [serverResponsePending, setServerResponsePending] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files);
      setSelectedImages([...selectedImages, ...newImages]);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== indexToRemove));
  };

  const handleRemoveExistingImage = async (indexToRemove: number) => {
    ("use server");
    const imagePath = productImages
      .filter((image: any) => image.image_id === indexToRemove)
      .map((image: any) => image.path);
    const response = await RemoveProductImage(indexToRemove, imagePath);
    if (response) {
      router.refresh();
    }
  };

  const handleFormSumbit = async (
    event: React.ChangeEvent<HTMLFormElement>
  ) => {
    setServerResponsePending(true);
    event.preventDefault();
    const formData = new FormData();

    formData.append("productId", productData.product_id);

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
      "units",
      (event.currentTarget.querySelector("#units") as HTMLInputElement).value
    );
    formData.append(
      "available",
      (event.currentTarget.querySelector("#available") as HTMLInputElement)
        .checked
        ? "true"
        : "false"
    );

    formData.append("imageCount", selectedImages.length.toString());

    selectedImages.forEach((image, i) => {
      formData.append(`image_${i}`, image);
    });

    ("use server");
    if (product == null) {
      const response = await addProduct(formData);
      setServerResponse(response);
      setServerResponsePending(false);
    } else {
      const response = await updateProduct(formData);
      setServerResponse(response);
      setServerResponsePending(false);
    }
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
          defaultValue={productData?.name}
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
          defaultValue={productData?.description}
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
          defaultValue={productData?.category}
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
          defaultValue={productData?.priceInPennies}
          onChange={(v) => setPriceInPennies(Number(v.target.value))}
          required
        />
        <div className="py-2 pl-2 mt-2 w-auto bg-color-pallet-03 rounded">
          {formatCurrency(Number(priceInPennies))}
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
          defaultValue={productData?.stock}
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
          onChange={handleImageChange}
          multiple
          required={productData == null}
        />
        <>
          <div className="grid grid-cols-3 py-2">
            {productImages?.map((image: any) => (
              <div key={image.image_id} className="flex flex-col">
                <img
                  key={image.image_id}
                  src={image.path}
                  alt={`Selected Image ${image.image_id}`}
                  width={200}
                  height={60}
                  className="m-2 w-52 h-48"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveExistingImage(image.image_id)}
                  className="bg-color-pallet-03 text-lg font-bold text-text-color-dark-green my-4 px-3 py-2 rounded hover:bg-color-pallet-04"
                >
                  Remove
                </button>
              </div>
            ))}
            {selectedImages.map((image, i) => (
              <div key={i} className="flex flex-col">
                <img
                  key={i}
                  src={URL.createObjectURL(image)}
                  alt={`Selected Image ${i}`}
                  width={200}
                  height={60}
                  className="m-2 w-52 h-48"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(i)}
                  className="bg-color-pallet-03 text-lg font-bold text-text-color-dark-green my-4 px-3 py-2 rounded hover:bg-color-pallet-04"
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
            productData?.isAvailable
              ? JSON.parse(productData?.isAvailable)
              : false
          }
        />
        <div className=" text-orange-600 pt-2">{serverResponse}</div>
        {!serverResponsePending ? (
          <button
            className="bg-color-pallet-03 text-lg font-bold text-text-color-dark-green my-4 px-3 py-2 rounded hover:bg-color-pallet-04"
            type="submit"
          >
            Save
          </button>
        ) : (
          <div className="bg-color-pallet-03 text-lg font-bold text-text-color-dark-green my-4 px-3 py-2 rounded hover:bg-color-pallet-04 text-center">
            Saving...
          </div>
        )}
      </div>
    </form>
  );
}
