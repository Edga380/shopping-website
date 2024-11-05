"use server";

import newClient from "../../utils/newClient";

export default async function deleteCartItem(cartId: number, userId: number) {
  const database = newClient();

  try {
    database
      .prepare(
        `
        DELETE
        FROM Cart
        WHERE cart_id = ? AND user_id = ?
        `
      )
      .run(cartId, userId);
  } catch (error) {
    throw error;
  }
}
