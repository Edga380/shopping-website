"use server";

import newClient from "../../utils/newClient";
import { OriginalProduct, UpdatedProduct } from "../../../types/databaseTypes";

export async function getBestSellerProducts(): Promise<UpdatedProduct[]> {
  const database = newClient();
  try {
    const products = database
      .prepare(
        `
        SELECT p.*,
        JSON_GROUP_ARRAY(
          JSON_OBJECT(
            'product_variation_id', pv.product_variation_id,
            'color', pc.color,
            'product_size_inventory', (
              SELECT
                JSON_GROUP_ARRAY(
                  JSON_OBJECT(
                    'size', ps.size,
                    'stock', pst.stock,
                    'sold', pst.sold,
                    'discount', pst.discount
                  )
                )
                  FROM ProductVariationSizeInventory pst 
                  JOIN ProductSize ps ON pst.size_id = ps.product_size_id 
                  WHERE pst.product_variation_id = pv.product_variation_id
                  ORDER BY pst.sold DESC
                ),
                'images', (
                  SELECT JSON_GROUP_ARRAY(pi.path) 
                  FROM ProductImages pi 
                  WHERE pi.product_variation_id = pv.product_variation_id
                )
              )
            ) AS product_variations
        FROM Product p
        JOIN ProductVariation pv ON p.product_id = pv.product_id
        JOIN ProductColor pc ON pv.color_id = pc.product_color_id
        WHERE p.is_available = ?
        GROUP BY p.product_id
        LIMIT 6
        `
      )
      .all("true") as OriginalProduct[];

    const parsedProductsVariations = products.map((product) => {
      return {
        ...product,
        product_variations: JSON.parse(product.product_variations),
      };
    });

    return parsedProductsVariations as UpdatedProduct[];
  } catch (error) {
    console.error(`Error getting products:`, error);
    throw error;
  }
}
