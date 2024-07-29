"use server";

import newClient from "../../utils/newClient";
import { UpdatedProduct } from "../../../types/databaseTypes";
import { OriginalProduct } from "../../../types/databaseTypes";

export async function getAllProducts(): Promise<UpdatedProduct[]> {
  const database = newClient();
  try {
    const products = database
      .prepare(
        `
      SELECT p.*,
      GROUP_CONCAT(DISTINCT pc.color) AS colors,
      GROUP_CONCAT(DISTINCT ps.size) AS sizes,
      GROUP_CONCAT(DISTINCT pi.path) AS images
      FROM Products p
      LEFT JOIN ProductColors pcr ON p.product_id = pcr.product_id
      LEFT JOIN ProductColor pc ON pcr.color_id = pc.productColor_id
      LEFT JOIN ProductSizes psr ON p.product_id = psr.product_id
      LEFT JOIN ProductSize ps ON psr.size_id = ps.productSize_id
      LEFT JOIN ProductImages pi ON p.product_id = pi.product_id
      GROUP BY p.product_id
      ORDER BY p.created_at DESC
      `
      )
      .all() as OriginalProduct[];

    const productImagesSplit = products.map((product) => {
      return {
        ...product,
        images: product.images.split(","),
        colors: product.colors.split(","),
        sizes: product.sizes.split(","),
      };
    });
    return productImagesSplit as UpdatedProduct[];
  } catch (error) {
    console.error(`Error getting products:`, error);
    throw error;
  }
}
