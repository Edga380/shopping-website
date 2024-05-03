"use server";

import fs from "fs/promises";
import { dirname, join } from "path";
import {
  addProductDB,
  updateProductDb,
  RemoveProductImageFromDb,
  UpdateProductAvailabilityFromDb,
  DeleteProductFromDb,
} from "../../../../database/db";

export async function addProduct(formData: FormData) {
  try {
    const {
      productId,
      name,
      description,
      category,
      priceInPennies,
      units,
      available,
      imageCount,
    } = Object.fromEntries(formData.entries());

    const images: File[] = [];

    const imageCountNumber = parseInt(imageCount as string);

    for (let i = 0; i < imageCountNumber; i++) {
      const currentImages = formData.getAll(`image_${i}`) as File[];
      images.push(...currentImages);
    }

    if (!images.length) {
      console.error("Choose images");
      return "Choose images";
    }

    const response = await addProductDB(
      name,
      description,
      category,
      priceInPennies,
      units,
      available,
      images
    );
    if (response) {
      await Promise.all(
        images.map(async (image) => {
          const imageBuffer = await image.arrayBuffer();
          const filePath = join(
            "public",
            "products",
            category as string,
            image.name
          );
          await fs.mkdir(dirname(filePath), { recursive: true });
          await fs.writeFile(filePath, Buffer.from(imageBuffer));
        })
      );
      console.log("Product added successfully into database.");
      return "Product added successfully into database.";
    } else {
      console.log("Failed to add product into database.");
      return "Failed to add product into database.";
    }
  } catch (error) {
    console.log("Error adding product: ", error);
    return "Error adding product";
  }
}

export async function updateProduct(formData: FormData) {
  try {
    const {
      productId,
      name,
      description,
      category,
      priceInPennies,
      units,
      available,
      imageCount,
    } = Object.fromEntries(formData.entries());

    const images: File[] = [];

    const imageCountNumber = parseInt(imageCount as string);

    for (let i = 0; i < imageCountNumber; i++) {
      const currentImages = formData.getAll(`image_${i}`) as File[];
      images.push(...currentImages);
    }

    const response = await updateProductDb(
      productId,
      name,
      description,
      category,
      priceInPennies,
      units,
      available,
      images
    );
    if (response) {
      if (!images.length) {
        console.log("No new images added");
        return "Product updated successfully in database. No new images added.";
      }
      await Promise.all(
        images.map(async (image) => {
          const imageBuffer = await image.arrayBuffer();
          const filePath = join(
            "public",
            "products",
            category as string,
            image.name
          );
          await fs.mkdir(dirname(filePath), { recursive: true });
          await fs.writeFile(filePath, Buffer.from(imageBuffer));
        })
      );
      console.log("Product updated successfully into database.");
      return "Product updated successfully into database.";
    } else {
      console.log("Failed to update product into database.");
      return "Failed to update product into database.";
    }
  } catch (error) {
    console.log("Error updating product: ", error);
    return "Error updating product";
  }
}

export async function UpdateProductAvailability(
  productId: number,
  isAvailable: string
) {
  const response = await UpdateProductAvailabilityFromDb(
    productId,
    isAvailable
  );
  if (response) {
    return true;
  }
  return false;
}

export async function DeleteProduct(productId: number) {
  const response = await DeleteProductFromDb(productId);
  if (response.success) {
    for (const imgPath of response.imagePath as any) {
      try {
        await fs.unlink(`public/${imgPath.path}`);
      } catch (error) {
        console.error("Error deleting image", error);
      }
    }
    return true;
  }
  return false;
}

export async function RemoveProductImage(
  indexToRemove: number,
  imagePath: any
) {
  const response = await RemoveProductImageFromDb(indexToRemove);
  if (response) {
    await fs.unlink(`public/${imagePath[0]}`);
    return true;
  }
  return false;
}
