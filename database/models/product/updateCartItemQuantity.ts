"use server";

import newClient from "../../utils/newClient";

export default async function updateCartItemQuantity(
  quantity: number,
  cartId: number,
  userId: number,
  productId: number
) {
  const database = newClient();

  try {
    database
      .prepare(
        `
        UPDATE Cart
        SET quantity = ?
        WHERE cart_id = ? AND user_id = ? AND product_id = ?
        `
      )
      .run(quantity, cartId, userId, productId);
  } catch (error) {
    throw error;
  }
}
