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

type productImage = {
  product_variation_id: number;
  path: string;
};

type variations = {
  product_variation_id: number;
  product_id: number;
  color: string;
};

export default async function editProduct(productFormData: FormData) {
  const database = newClient();

  const productFormDataEntries = Object.fromEntries(productFormData.entries());

  const {
    productId,
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

  const existingImagesFormData: string[] = [];

  for (const [key, imagePath] of Object.entries(productFormDataEntries)) {
    if (key.startsWith("existingImagePath_")) {
      existingImagesFormData.push(imagePath as string);
    }
  }

  const groupedNewImagesFilesByColor: groupedFilesByColor[] = [];

  for (const [key, value] of Object.entries(productFormDataEntries)) {
    if (key.startsWith("selectedImageFile_")) {
      const fileIndex = key.split("_")[1];
      const colorKey = `selectedImageColor_${fileIndex}`;

      if (productFormDataEntries[colorKey]) {
        const file = value as File;
        const color = productFormDataEntries[colorKey] as string;

        groupedNewImagesFilesByColor.push({ file, color });
      }
    }
  }

  const updateProduct = database.transaction(() => {
    database
      .prepare(
        `
        UPDATE Product
        SET name = ?, description = ?, category = ?, base_price_in_pennies = ?, gender = ?, is_available = ?
        WHERE product_id = ?
        `
      )
      .run(
        name,
        description,
        category,
        basePriceInPennies,
        gender,
        isAvailable,
        productId
      );
  });

  const addNewVariations = database.transaction(() => {
    updateProduct();

    const existingVariations = database
      .prepare(
        `
        SELECT pc.color
        FROM ProductVariation pv
        INNER JOIN ProductColor pc ON pv.color_id = pc.product_color_id
        WHERE product_id = ?
        `
      )
      .all(productId) as variations[];

    const variationsToAdd = groupedInventoryDataByColor.filter(
      ({ color }) =>
        !existingVariations.some(
          (existingVariation) => existingVariation.color === color
        )
    );

    variationsToAdd.forEach((variation) => {
      const insertedVariationResult = database
        .prepare(
          `
          INSERT
          INTO ProductVariation
            (product_id, color_id)
          SELECT ?, product_color_id
          FROM ProductColor
          WHERE color = ?
        `
        )
        .run(productId, variation.color);

      if (insertedVariationResult.changes > 0) {
        variation.inventoryData.forEach((data) => {
          database
            .prepare(
              `
              INSERT
              INTO ProductVariationSizeInventory
                (product_variation_id, size_id, stock, sold, discount)
              SELECT ?, product_size_id, ?, ?, ?
              FROM ProductSize
              WHERE size = ?
              `
            )
            .run(
              insertedVariationResult.lastInsertRowid,
              data.stock,
              data.sold,
              data.discount,
              data.size
            );
        });
      }
    });
  });

  const variationImagesToDeleteStored: string[] = [];

  const removeVariations = database.transaction(() => {
    addNewVariations();

    const variations = database
      .prepare(
        `
        SELECT pc.color
        FROM ProductVariation pv
        INNER JOIN ProductColor pc ON pv.color_id = pc.product_color_id
        WHERE product_id = ?
        `
      )
      .all(productId) as variations[];

    const variationsToDelete = variations.filter(
      ({ color }) =>
        !groupedInventoryDataByColor.some(
          (inventoryData) => inventoryData.color === color
        )
    );

    if (variationsToDelete.length > 0) {
      variationsToDelete.forEach(({ color }) => {
        const variationImagesToDelete = database
          .prepare(
            `
            SELECT pi.path
            FROM ProductImages pi
            INNER JOIN ProductVariation pv ON pi.product_variation_id = pv.product_variation_id
            INNER JOIN ProductColor pc ON pv.color_id = pc.product_color_id
            WHERE pc.color = ? AND pv.product_id = ?
            `
          )
          .all(color, productId) as { path: string }[];

        variationImagesToDelete.forEach(async ({ path }) => {
          variationImagesToDeleteStored.push(path);
        });

        database
          .prepare(
            `
            DELETE FROM ProductVariation
            WHERE product_variation_id IN (
              SELECT pv.product_variation_id
              FROM ProductVariation pv
              INNER JOIN ProductColor pc ON pv.color_id = pc.product_color_id
              WHERE pc.color = ? AND pv.product_id = ?
            )
            `
          )
          .run(color, productId);
      });
    }
  });

  const updateVariationSizeInventory = database.transaction(() => {
    removeVariations();

    groupedInventoryDataByColor.forEach((inventoryDataByColor) => {
      const { product_variation_id } = database
        .prepare(
          `
          SELECT product_variation_id
          FROM ProductVariationSizeInventory
          WHERE product_variation_id IN (
            SELECT product_variation_id FROM ProductVariation WHERE product_id = ? AND color_id IN (
            SELECT product_color_id FROM ProductColor WHERE color = ?
            )
          )
          `
        )
        .get(productId, inventoryDataByColor.color) as {
        product_variation_id: number;
      };

      inventoryDataByColor.inventoryData.forEach((sizeToAdd) => {
        database
          .prepare(
            `
            INSERT 
            INTO ProductVariationSizeInventory
              (product_variation_id, size_id, stock, sold, discount)
            SELECT ?, product_size_id, ?, ?, ?
            FROM ProductSize
            WHERE size = ?
            ON CONFLICT(product_variation_id, size_id)
            DO UPDATE SET
              stock = excluded.stock,
              sold = excluded.sold,
              discount = excluded.discount
            `
          )
          .run(
            product_variation_id,
            sizeToAdd.stock,
            sizeToAdd.sold,
            sizeToAdd.discount,
            sizeToAdd.size
          );
      });

      const existingSizes = (
        database
          .prepare(
            `
            SELECT size
            FROM ProductSize
            WHERE product_size_id IN (
              SELECT size_id FROM ProductVariationSizeInventory WHERE product_variation_id = ?
            )
            `
          )
          .all(product_variation_id) as { size: string }[]
      ).map((data) => data.size);

      const sizesToRemove = existingSizes.filter(
        (existingSize) =>
          !inventoryDataByColor.inventoryData.some(
            ({ size }) => size === existingSize
          )
      );

      if (sizesToRemove.length > 0) {
        sizesToRemove.forEach((size) => {
          database
            .prepare(
              `
              DELETE
              FROM ProductVariationSizeInventory
              WHERE product_variation_id = ? AND size_id IN (
                SELECT product_size_id FROM ProductSize WHERE size = ?
              )
              `
            )
            .run(product_variation_id, size);
        });
      }
    });
  });

  const existingImagesToRemoveStored: string[] = [];

  const updateExistingImages = database.transaction(() => {
    updateVariationSizeInventory();

    const existingImagesFromDatabase = database
      .prepare(
        `
          SELECT *
          FROM ProductImages
          WHERE product_variation_id IN (
            SELECT product_variation_id FROM ProductVariation WHERE product_id = ?
          )
          `
      )
      .all(productId) as productImage[];

    const existingImagesToRemove = existingImagesFromDatabase
      .filter(({ path }) => !existingImagesFormData.includes(path))
      .map(({ path }) => path);

    existingImagesToRemoveStored.push(...existingImagesToRemove);

    if (existingImagesToRemove.length > 0) {
      existingImagesToRemove.forEach(async (imageToRemove) => {
        database
          .prepare(
            `
              DELETE
              FROM ProductImages
              WHERE path = ?
              `
          )
          .run(imageToRemove);
      });
    }
  });

  const insertNewImages = database.transaction(() => {
    updateExistingImages();

    groupedNewImagesFilesByColor.forEach((newImagesFile) => {
      database
        .prepare(
          `
          INSERT INTO ProductImages (product_variation_id, path)
          SELECT pv.product_variation_id, ?
          FROM ProductVariation pv
          INNER JOIN ProductColor pc ON pv.color_id = pc.product_color_id
          WHERE pv.product_id = ? AND pc.color = ?
          `
        )
        .run(
          `/products/${newImagesFile.file.name}`,
          productId,
          newImagesFile.color
        );
    });
  });

  try {
    insertNewImages();

    await Promise.all(
      variationImagesToDeleteStored.map(async (path) => {
        await fs.unlink(`public${path}`);
      })
    );

    await Promise.all(
      existingImagesToRemoveStored.map(async (existingImageToRemoveStored) => {
        await fs.unlink(`public${existingImageToRemoveStored}`);
      })
    );

    await Promise.all(
      groupedNewImagesFilesByColor.map(async (newImagesFile) => {
        const imageBuffer = await newImagesFile.file.arrayBuffer();
        const filePath = join("public", "products", newImagesFile.file.name);
        await fs.mkdir(dirname(filePath), { recursive: true });
        await fs.writeFile(filePath, Buffer.from(imageBuffer));
      })
    );
  } catch (error) {
    throw error;
  }
}
