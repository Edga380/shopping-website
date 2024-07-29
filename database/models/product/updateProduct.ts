"use server";

import newClient from "../../utils/newClient";
import fs from "fs/promises";
import { join, dirname } from "path";

type ProductImage = {
  image_id: number;
  product_id: number;
  path: string;
};

type ProductSizeId = {
  productSize_id: number;
};

type ProductColorId = {
  productColor_id: number;
};

export default async function updateProduct(productFormData: FormData) {
  const database = newClient();

  const transaction = database.transaction(async () => {
    try {
      const {
        productId,
        name,
        description,
        category,
        priceInPennies,
        stock,
        sold,
        gender,
        colorsCount,
        sizesCount,
        existingImagesCount,
        newImagesCount,
        available,
      } = Object.fromEntries(productFormData.entries());

      const colors: string[] = [];

      const parseColorsCount = parseInt(colorsCount as string);

      for (let i = 0; i < parseColorsCount; i++) {
        const currentColors = productFormData.getAll(`color_${i}`) as string[];
        colors.push(...currentColors);
      }

      const sizes: string[] = [];

      const parseSizesCount = parseInt(sizesCount as string);

      for (let i = 0; i < parseSizesCount; i++) {
        const currentSizes = productFormData.getAll(`size_${i}`) as string[];
        sizes.push(...currentSizes);
      }

      const existingImages: string[] = [];

      const parseExistingImagesCount = parseInt(existingImagesCount as string);

      for (let i = 0; i < parseExistingImagesCount; i++) {
        const existingImage = productFormData.getAll(
          `existing_image_${i}`
        ) as string[];
        existingImages.push(...existingImage);
      }

      const newImages: File[] = [];

      const parseNewImagesCount = parseInt(newImagesCount as string);

      for (let i = 0; i < parseNewImagesCount; i++) {
        const newImage = productFormData.getAll(`new_image_${i}`) as File[];
        newImages.push(...newImage);
      }

      const product = {
        product_id: productId,
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
        existingImages: existingImages.map((image) => image),
        newImages: newImages.map((image) => image.name),
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

      database
        .prepare(
          `
        UPDATE Products 
        SET 
          name = :name, 
          description = :description, 
          category = :category, 
          priceInPennies = :priceInPennies, 
          stock = :stock, 
          sold = :sold, 
          gender = :gender,
          isAvailable = :isAvailable 
        WHERE product_id = :product_id
        `
        )
        .run(product);

      const productImagesNamesDb = database
        .prepare(
          `
        SELECT * 
        FROM ProductImages 
        WHERE product_id = ?
        `
        )
        .all(product.product_id)
        .map((image) => (image as ProductImage).path);

      const productImagesToDelete = productImagesNamesDb.filter(
        (name) => !product.existingImages.includes(name)
      );

      database
        .prepare(
          `
        DELETE 
        FROM ProductImages 
        WHERE product_id = ?
        `
        )
        .run(product.product_id);

      for (const image of product.existingImages) {
        database
          .prepare(
            `
            INSERT INTO ProductImages 
            (product_id, path) 
            VALUES (?, ?)
            `
          )
          .run(product.product_id, image);
      }

      for (const image of product.newImages) {
        database
          .prepare(
            `
          INSERT INTO ProductImages 
          (product_id, path) 
          VALUES (?, ?)
          `
          )
          .run(product.product_id, image);
      }

      database
        .prepare(
          `
        DELETE 
        FROM ProductSizes 
        WHERE product_id = ?
        `
        )
        .run(product.product_id);

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
          .run(product.product_id, productSize_id);
      }

      database
        .prepare(
          `
        DELETE 
        FROM ProductColors 
        WHERE product_id = ?
        `
        )
        .run(product.product_id);

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
          .run(product.product_id, productColor_id);

        if (newImages.length > 0) {
          await Promise.all(
            newImages.map(async (image) => {
              const imageBuffer = await image.arrayBuffer();
              const filePath = join("public", "products", image.name);
              await fs.mkdir(dirname(filePath), { recursive: true });
              await fs.writeFile(filePath, Buffer.from(imageBuffer));
            })
          );
        }

        if (productImagesToDelete.length > 0) {
          await Promise.all(
            productImagesToDelete.map(async (name) => {
              await fs.unlink(`public/products/${name}`);
            })
          );
        }
      }
    } catch (error) {
      console.error("Failed to update product: ", error);
      throw error;
    }
  });
  return transaction();
}
