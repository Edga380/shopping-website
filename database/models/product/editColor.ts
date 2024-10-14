"use server";

import newClient from "../../utils/newClient";

export default async function editColor(id: number, color: string) {
  const database = newClient();

  try {
    database
      .prepare(
        `
        UPDATE ProductColor
        SET color = ?
        WHERE product_color_id = ?
        `
      )
      .run(color, id);
  } catch (error) {
    console.error("Error inside editColor.ts: ", error);
    throw error;
  }
}
