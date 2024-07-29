"use server";

import newClient from "../../utils/newClient";
import fs from "fs/promises";

export default async function deleteProduct(
  imagesPath: string[],
  productId: number
) {
  const database = newClient();

  database.exec("BEGIN TRANSACTION");

  try {
    database
      .prepare(
        `
            DELETE 
            FROM ProductSizes
            WHERE product_id = ?
            `
      )
      .run(productId);

    database
      .prepare(
        `
            DELETE 
            FROM ProductColors
            WHERE product_id = ?
            `
      )
      .run(productId);

    database
      .prepare(
        `
            DELETE 
            FROM ProductImages
            WHERE product_id = ?
            `
      )
      .run(productId);

    database
      .prepare(
        `
              DELETE 
              FROM Products
              WHERE product_id = ?
              `
      )
      .run(productId);

    database.exec("COMMIT");

    await Promise.all(
      imagesPath.map(async (imagePath) => {
        await fs.unlink(`public/products/${imagePath}`);
      })
    );
  } catch (error) {
    database.exec("ROLLBACK");
    console.error(error);
    throw error;
  }
}
