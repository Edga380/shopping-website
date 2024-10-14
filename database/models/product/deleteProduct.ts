"use server";

import newClient from "../../utils/newClient";
import fs from "fs/promises";

export default async function deleteProduct(
  imagesPath: string[],
  productId: number
) {
  const database = newClient();

  try {
    database
      .prepare(
        `
        DELETE 
        FROM Product
        WHERE product_id = ?
        `
      )
      .run(productId);

    await Promise.all(
      imagesPath.map(async (imagePath) => {
        await fs.unlink(`public${imagePath}`);
      })
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
}
