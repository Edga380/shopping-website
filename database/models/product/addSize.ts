"use server";

import { Database } from "better-sqlite3";
import newClient from "../../utils/newClient";

export default async function addSize(size: string, category: string) {
  const database = newClient();

  try {
    const addSizeAndCategory = database.transaction(() => {
      const result = database
        .prepare(
          `
          INSERT
          INTO ProductSize
            (size)
          VALUES
            (?)
          ON CONFLICT (size) DO NOTHING;
          `
        )
        .run(size);

      if (result.changes === 0) {
        const { product_size_id } = database
          .prepare(
            `
            SELECT product_size_id 
            FROM ProductSize 
            WHERE size = ?
            `
          )
          .get(size) as { product_size_id: number };

        insertProductCategorySize(database, product_size_id, category);
      } else {
        insertProductCategorySize(database, result.lastInsertRowid, category);
      }
    });

    addSizeAndCategory();
  } catch (error) {
    throw error;
  }
}

function insertProductCategorySize(
  database: Database,
  sizeId: number | bigint,
  category: string
) {
  database
    .prepare(
      `
      INSERT
      INTO ProductCategorySize
        (category_id, size_id)
      SELECT product_category_id, ?
      FROM ProductCategory
      WHERE category = ?
      `
    )
    .run(sizeId, category);
}
