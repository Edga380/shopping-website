"use server";

import newClient from "../../utils/newClient";

export default async function addCategory(category: string) {
  const database = newClient();

  try {
    database
      .prepare(
        `
        INSERT
        INTO ProductCategory
            (category)
        VALUES
            (?)
        `
      )
      .run(category);

    return { success: true, message: "Category added.", color: "green" };
  } catch (error) {
    throw error;
  }
}
