"use server";

import { OriginalProduct, UpdatedProduct } from "../../../types/databaseTypes";
import newClient from "../../utils/newClient";

export default async function getProduct(
  productId: string,
  isAvailable = null
): Promise<UpdatedProduct> {
  const database = newClient();
  try {
    let query = `
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
                FROM ProductVariationSizeInventory pst JOIN ProductSize ps ON pst.size_id = ps.product_size_id WHERE pst.product_variation_id = pv.product_variation_id
              ),
              'images', (
                SELECT JSON_GROUP_ARRAY(pi.path) FROM ProductImages pi WHERE pi.product_variation_id = pv.product_variation_id
                )
              )
            ) AS product_variations
    FROM Product p
    JOIN ProductVariation pv ON p.product_id = pv.product_id
    JOIN ProductColor pc ON pv.color_id = pc.product_color_id
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

    const parsedProductVariations = {
      ...product,
      product_variations: JSON.parse(product.product_variations),
    };

    return parsedProductVariations as UpdatedProduct;
  } catch (error) {
    console.error(`Error retrieving product data: `, error);
    throw error;
  }
}
