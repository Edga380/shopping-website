"use server";

import newClient from "../../utils/newClient";
import fs from "fs/promises";
import { join, dirname } from "path";

type ProductSizeId = {
  productSize_id: number;
};

type ProductColorId = {
  productColor_id: number;
};

export async function addProduct(productFormData: FormData) {
  const database = newClient();

  const transaction = database.transaction(async () => {
    try {
      const name = productFormData.get("name") as string;
      const description = productFormData.get("description") as string;
      const category = productFormData.get("category") as string;
      const priceInPennies = parseInt(
        productFormData.get("priceInPennies") as string
      );
      const stock = parseInt(productFormData.get("stock") as string);
      const sold = parseInt(productFormData.get("sold") as string);
      const gender = productFormData.get("gender") as string;
      const colorsCount = parseInt(
        productFormData.get("colorsCount") as string
      );
      const sizesCount = parseInt(productFormData.get("sizesCount") as string);
      const newImagesCount = productFormData.get("newImagesCount") as string;
      const available = productFormData.get("available") as string;

      const colors: string[] = [];

      for (let i = 0; i < colorsCount; i++) {
        const currentColors = productFormData.getAll(`color_${i}`) as string[];
        colors.push(...currentColors);
      }

      const sizes: string[] = [];

      for (let i = 0; i < sizesCount; i++) {
        const currentSizes = productFormData.getAll(`size_${i}`) as string[];
        sizes.push(...currentSizes);
      }

      const newImages: File[] = [];

      const parseNewImagesCount = parseInt(newImagesCount);

      for (let i = 0; i < parseNewImagesCount; i++) {
        const newImage = productFormData.getAll(`new_image_${i}`) as File[];
        newImages.push(...newImage);
      }

      if (newImages.length < 1 || colors.length < 1 || sizes.length < 1) {
        return `Choose atleast one: ${newImages.length < 1 ? "(Image)" : ""} ${
          colors.length < 1 ? "(Color)" : ""
        } ${sizes.length < 1 ? "(Size)" : ""}`;
      }

      const product = {
        name: name,
        description: description,
        category: category,
        priceInPennies: priceInPennies,
        stock: stock,
        sold: sold,
        gender: gender,
        colors: colors,
        sizes: sizes,
        isAvailable: available,
        images: newImages,
      };

      for (const size of product.sizes) {
        const existingSize = database
          .prepare(
            `
            SELECT productSize_id 
            FROM ProductSize 
            WHERE size = ?
            `
          )
          .get(size);
        if (!existingSize) {
          database
            .prepare(
              `
              INSERT 
              INTO ProductSize (size) 
              VALUES (?)
              `
            )
            .run(size);
        }
      }

      for (const color of product.colors) {
        const existingColor = database
          .prepare(
            `
            SELECT productColor_id 
            FROM ProductColor 
            WHERE color = ?
            `
          )
          .get(color);
        if (!existingColor) {
          database
            .prepare(
              `
              INSERT 
              INTO ProductColor (color) 
              VALUES (?)
              `
            )
            .run(color);
        }
      }
      const info = database
        .prepare(
          `
            INSERT 
            INTO Products 
              (name, description, category, priceInPennies, stock, sold, gender, isAvailable) 
            VALUES 
              (@name, @description, @category, @priceInPennies, @stock, @sold, @gender, @isAvailable)
            `
        )
        .run(product);
      const productId = info.lastInsertRowid;

      for (const image of product.images) {
        database
          .prepare(
            `
              INSERT 
              INTO ProductImages (product_id, path) 
              VALUES (?, ?)
              `
          )
          .run(productId, image.name);
      }

      for (const size of product.sizes) {
        const { productSize_id } = database
          .prepare(
            `
              SELECT productSize_id 
              FROM ProductSize 
              WHERE size = ?
              `
          )
          .get(size) as ProductSizeId;
        database
          .prepare(
            `
              INSERT 
              INTO ProductSizes (product_id, size_id) 
              VALUES (?, ?)
              `
          )
          .run(productId, productSize_id);
      }

      for (const color of product.colors) {
        const { productColor_id } = database
          .prepare(
            `
              SELECT productColor_id 
              FROM ProductColor 
              WHERE color = ?
              `
          )
          .get(color) as ProductColorId;
        database
          .prepare(
            `
              INSERT 
              INTO ProductColors (product_id, color_id) 
              VALUES (?, ?)
              `
          )
          .run(productId, productColor_id);
      }

      if (product.images.length > 0) {
        await Promise.all(
          product.images.map(async (image) => {
            const imageBuffer = await image.arrayBuffer();
            const filePath = join("public", "products", image.name);
            await fs.mkdir(dirname(filePath), { recursive: true });
            await fs.writeFile(filePath, Buffer.from(imageBuffer));
          })
        );
      }
    } catch (error) {
      console.error("Error adding product: ", error);
      throw error;
    }
  });
  return transaction();
}
