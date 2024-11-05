"use server";

import newClient from "../../utils/newClient";

export default async function addToCart(
  user_id: number,
  product_id: number,
  product_variation_id: number,
  product_size: string,
  quantity: number
) {
  const database = newClient();

  try {
    database
      .prepare(
        `
        INSERT
        INTO Cart
            (user_id, product_id, product_variation_id, product_size, quantity)
        VALUES
            (?, ?, ?, ?, ?)
        `
      )
      .run(user_id, product_id, product_variation_id, product_size, quantity);
  } catch (error) {
    throw error;
  }
}
