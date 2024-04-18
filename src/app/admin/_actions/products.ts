"use server";

import fs from "fs/promises";
import { join } from "path";
import { addProductDB } from "../../../../database/db";

export async function addProduct(formData: FormData, imagesCount: number) {
  try {
    const { name, description, category, priceInPennies, units, available } =
      Object.fromEntries(formData.entries());

    const images: File[] = [];

    for (let i = 0; i < imagesCount; i++) {
      const currentImages = formData.getAll(`image_${i}`) as File[];
      images.push(...currentImages);
    }

    if (!images.length) {
      console.error("No image found in form data!");
      return;
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
        await fs.writeFile(filePath, Buffer.from(imageBuffer));
        console.log(filePath);
      })
    );

    const response = addProductDB(
      name,
      description,
      category,
      priceInPennies,
      units,
      available,
      images
    );
    console.log("Product added successfully!");
  } catch (error) {
    console.log("Error adding product: ", error);
  }
}
