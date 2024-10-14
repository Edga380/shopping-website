"use server";

import newClient from "../../utils/newClient";

export default async function deleteSize(sizeId: number, category: string) {
  const database = newClient();

  try {
    database
      .prepare(
        `
      DELETE
      FROM ProductCategorySize
      WHERE size_id = ? AND category_id IN (
        SELECT product_category_id FROM ProductCategory WHERE category = ?
      )
      `
      )
      .run(sizeId, category);

    const result = database
      .prepare(
        `
      SELECT *
      FROM ProductCategorySize
      WHERE size_id = ?
      `
      )
      .all(sizeId);

    if (result.length === 0) {
      database
        .prepare(
          `
          DELETE
          FROM ProductSize
          WHERE product_size_id = ?
          `
        )
        .run(sizeId);
    }
  } catch (error) {
    console.error("Error inside deleteSize.ts: ", error);
    throw error;
  }
}
