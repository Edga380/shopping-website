"use server";

import { Cart } from "../../../types/databaseTypes";
import newClient from "../../utils/newClient";

export default async function getCartData(userId: number) {
  const database = newClient();

  try {
    const cartData = database
      .prepare(
        `
        SELECT *
        FROM Cart
        WHERE user_id = ?
        `
      )
      .all(userId) as Cart[];

    return cartData;
  } catch (error) {
    throw error;
  }
}
