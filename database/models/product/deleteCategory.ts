"use server";

import newClient from "../../utils/newClient";

export default async function deleteCategory(id: number) {
  const database = newClient();

  try {
    database
      .prepare(
        `
        DELETE
        FROM ProductCategory
        WHERE product_category_id = ?
        `
      )
      .run(id);
  } catch (error) {
    console.error("Error inside deleteCategory.ts:", error);
    throw error;
  }
}
