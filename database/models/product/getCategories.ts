"use server";

import newClient from "../../utils/newClient";
import { getProductCategories } from "../../../types/databaseTypes";

export default async function getCategories() {
  const database = newClient();

  try {
    const categories = database
      .prepare(
        `
            SELECT *
            FROM ProductCategory
            `
      )
      .all() as getProductCategories[];

    return categories;
  } catch (error) {
    console.error("Error inside getCategories.ts: ", error);
    throw error;
  }
}
