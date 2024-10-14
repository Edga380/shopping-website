"use server";

import newClient from "../../utils/newClient";

export default async function deleteColor(id: number) {
  const database = newClient();

  try {
    database
      .prepare(
        `
        DELETE
        FROM ProductColor
        WHERE product_color_id = ?
        `
      )
      .run(id);
  } catch (error) {
    console.error("Error inside deleteColor.ts: ", error);
    throw error;
  }
}
