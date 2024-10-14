"use server";

import newClient from "../../utils/newClient";
import {
  NewestBestSellerProduct,
  NewestBestSellerProducts,
} from "../../../types/databaseTypes";

export async function getBestSellerProducts(): Promise<
  NewestBestSellerProducts[]
> {
  const database = newClient();
  try {
    const products = database
      .prepare(
        `
      SELECT 
      p.product_id, p.name, p.priceInPennies,
      GROUP_CONCAT(DISTINCT pi.path) AS images
      FROM Products p
      LEFT JOIN ProductImages pi ON p.product_id = pi.product_id
      WHERE p.isAvailable = ?
      GROUP BY p.product_id
      ORDER BY p.sold DESC
      LIMIT 6
      `
      )
      .all("true") as NewestBestSellerProduct[];

    return products.map((productData) => {
      return {
        ...productData,
        images: productData.images ? productData.images.split(",") : [],
      };
    });
  } catch (error) {
    console.error(`Error getting products:`, error);
    throw error;
  }
}
