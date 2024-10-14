"use server";

import { getProductSizes } from "../../../types/databaseTypes";
import newClient from "../../utils/newClient";

export default async function getSizes() {
  const database = newClient();

  try {
    const sizes = database
      .prepare(
        `
        SELECT ps.*,
        JSON_GROUP_ARRAY(
          (SELECT category FROM ProductCategory pc WHERE pc.product_category_id = pcs.category_id)
          ) AS categories
        FROM ProductSize ps
        JOIN ProductCategorySize pcs ON ps.product_size_id = pcs.size_id
        GROUP BY ps.product_size_id
        `
      )
      .all() as getProductSizes[];

    const parseSizes = sizes.map((size) => ({
      ...size,
      categories: JSON.parse(size.categories),
    }));

    return parseSizes;
  } catch (error) {
    console.error("Error inside getSizes.ts:", error);
    throw error;
  }
}
