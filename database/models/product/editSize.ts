"use server";

import newClient from "../../utils/newClient";

export default async function editSize(id: number, size: string) {
  const database = newClient();

  try {
    database
      .prepare(
        `
        UPDATE ProductSize
        SET size = ?
        WHERE product_size_id = ?
        `
      )
      .run(size, id);
  } catch (error) {
    console.error("Error inside editSize.ts: ", error);
    throw error;
  }
}
