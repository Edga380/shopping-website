"use server";

import newClient from "../../utils/newClient";

export default async function editCategory(id: number, category: string) {
  const database = newClient();

  try {
    database
      .prepare(
        `
        UPDATE ProductCategory
        SET category = ?
        WHERE product_category_id = ?
        `
      )
      .run(category, id);
  } catch (error) {
    console.error("Error inside editCategory.ts: ", error);
    throw error;
  }
}
