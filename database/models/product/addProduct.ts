"use server";

import newClient from "../../utils/newClient";
import fs from "fs/promises";
import { join, dirname } from "path";

type inventoryData = {
  size: string;
  stock: string;
  sold: string;
  discount: string;
};

type groupedSizesInventoryByColor = {
  color: string;
  inventoryData: inventoryData[];
};

type parseSelectedInventoryData = {
  color: string;
  size: string;
  stock: string;
  sold: string;
  discount: string;
};

type groupedFilesByColor = {
  file: File;
  color: string;
};

export default async function addProduct(productFormData: FormData) {
  const database = newClient();

  const productFormDataEntries = Object.fromEntries(productFormData.entries());

  const {
    name,
    description,
    category,
    basePriceInPennies,
    gender,
    selectedInventoryData,
    isAvailable,
  } = productFormDataEntries;

  const parseInventoryData = JSON.parse(selectedInventoryData as string);

  const groupedInventoryDataByColor: groupedSizesInventoryByColor[] =
    parseInventoryData.reduce(
      (
        acc: groupedSizesInventoryByColor[],
        parseSelectedSizeStock: parseSelectedInventoryData
      ) => {
        let existingColor = acc.find(
          (colorObject) => colorObject.color === parseSelectedSizeStock.color
        );

        if (existingColor) {
          existingColor.inventoryData.push({
            size: parseSelectedSizeStock.size,
            stock: parseSelectedSizeStock.stock,
            sold: parseSelectedSizeStock.sold,
            discount: parseSelectedSizeStock.discount,
          });
        } else {
          acc.push({
            color: parseSelectedSizeStock.color,
            inventoryData: [
              {
                size: parseSelectedSizeStock.size,
                stock: parseSelectedSizeStock.stock,
                sold: parseSelectedSizeStock.sold,
                discount: parseSelectedSizeStock.discount,
              },
            ],
          });
        }

        return acc;
      },
      [] as groupedSizesInventoryByColor[]
    );

  const groupedFilesByColor: groupedFilesByColor[] = [];

  for (const [key, value] of Object.entries(productFormDataEntries)) {
    if (key.startsWith("selectedImageFile_")) {
      const fileIndex = key.split("_")[1];
      const colorKey = `selectedImageColor_${fileIndex}`;

      if (productFormDataEntries[colorKey]) {
        const file = value as File;
        const color = productFormDataEntries[colorKey] as string;

        groupedFilesByColor.push({ file, color });
      }
    }
  }

  const insertProduct = database.transaction(() => {
    const productResult = database
      .prepare(
        `
          INSERT
          INTO Product
            (name, description, category, base_price_in_pennies, gender, is_available)
          VALUES
            (?, ?, ?, ?, ?, ?)
          `
      )
      .run(
        name,
        description,
        category,
        basePriceInPennies,
        gender,
        isAvailable
      );

    return productResult.lastInsertRowid;
  });

  const insertImages = database.transaction(
    (
      groupedFilesByColor: groupedFilesByColor[],
      productVariationId,
      productVariationcolor
    ) => {
      groupedFilesByColor.forEach(({ color, file }) => {
        if (color === productVariationcolor) {
          const imagePath = `/products/${file.name}`;

          database
            .prepare(
              `
              INSERT
              INTO ProductImages
                (product_variation_id, path)
              VALUES (?, ?)
              `
            )
            .run(productVariationId, imagePath);
        }
      });
    }
  );

  const selectColorInsertVariation = database.transaction(
    (groupedInventoryDataByColor) => {
      const productId = insertProduct();

      groupedInventoryDataByColor.forEach(
        ({ color, inventoryData }: groupedSizesInventoryByColor) => {
          const { product_color_id } = database
            .prepare(
              `
              SELECT product_color_id
              FROM ProductColor
              WHERE color = ?
              `
            )
            .get(color) as { product_color_id: number };
          const productVariationId = database
            .prepare(
              `
              INSERT
              INTO ProductVariation 
                (product_id, color_id)
              VALUES 
                (?, ?)
              `
            )
            .run(productId, product_color_id);

          insertImages(
            groupedFilesByColor,
            productVariationId.lastInsertRowid,
            color
          );

          inventoryData.forEach(({ size, stock, sold, discount }) => {
            const { product_size_id } = database
              .prepare(
                `
                SELECT product_size_id
                FROM ProductSize
                WHERE size = ?
                `
              )
              .get(size) as { product_size_id: string };
            database
              .prepare(
                `
                INSERT
                INTO ProductVariationSizeInventory 
                  (product_variation_id, size_id, stock, sold, discount)
                VALUES 
                  (?, ?, ?, ?, ?)
                `
              )
              .run(
                productVariationId.lastInsertRowid,
                product_size_id,
                stock,
                sold,
                discount
              );
          });
        }
      );
    }
  );

  try {
    selectColorInsertVariation(groupedInventoryDataByColor);

    if (groupedFilesByColor.length > 0) {
      await Promise.all(
        groupedFilesByColor.map(async ({ file }) => {
          const imageBuffer = await file.arrayBuffer();
          const filePath = join("public", "products", file.name);
          await fs.mkdir(dirname(filePath), { recursive: true });
          await fs.writeFile(filePath, Buffer.from(imageBuffer));
        })
      );
    }
  } catch (error) {
    console.error("Error adding product: ", error);
    throw error;
  }
}
