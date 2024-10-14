"use server";

import newClient from "../../utils/newClient";

export default async function updateAvailability(
  productId: number,
  isAvailable: string
) {
  const database = newClient();

  const changeIsAvailableValue = isAvailable === "true" ? "false" : "true";
  try {
    database
      .prepare(
        `
        UPDATE Product
        SET is_available = ?
        WHERE product_id = ?
        `
      )
      .run(changeIsAvailableValue, productId);
  } catch (error) {
    console.error("Failed to update product availability: ", error);
    throw error;
  }
}
