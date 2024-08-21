"use server";

import { OriginalProduct, UpdatedProduct } from "../../../types/databaseTypes";
import newClient from "../../utils/newClient";

export async function getProduct(
  productId: string,
  isAvailable = null
): Promise<UpdatedProduct> {
  const database = newClient();
  try {
    let query = `
    SELECT p.*,
    GROUP_CONCAT(DISTINCT ps.size) AS sizes,
    GROUP_CONCAT(DISTINCT pc.color) AS colors,
    GROUP_CONCAT(DISTINCT pi.path) AS images
    FROM Products p
    LEFT JOIN ProductSizes psr ON p.product_id = psr.product_id
    LEFT JOIN ProductSize ps ON psr.size_id = ps.productSize_id
    LEFT JOIN ProductColors pcr ON p.product_id = pcr.product_id
    LEFT JOIN ProductColor pc ON pcr.color_id = pc.productColor_id
    LEFT JOIN ProductImages pi ON p.product_id = pi.product_id
    WHERE p.product_id = ?
  `;

    if (isAvailable !== null) {
      query += `
      AND p.isAvailable = ?
      `;
    }

    query += `
    GROUP BY p.product_id
    ORDER BY p.created_at DESC
  `;

    const statement = database.prepare(query);
    const params = [productId];
    if (isAvailable !== null) {
      params.push(isAvailable);
    }
    const product = statement.get(...params) as OriginalProduct;

    return {
      ...product,
      colors: product.colors.split(","),
      sizes: product.sizes.split(","),
      images: product.images.split(","),
    };
  } catch (error) {
    console.error(`Error retrieving product data: `, error);
    throw error;
  }
}
