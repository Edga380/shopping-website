"use server";

import { getProductColors } from "../../../types/databaseTypes";
import newClient from "../../utils/newClient";

export default async function getColors() {
  const database = newClient();

  try {
    const colors = database
      .prepare(
        `
            SELECT *
            FROM ProductColor
            `
      )
      .all() as getProductColors[];

    return colors;
  } catch (error) {
    console.error("Error inside getColors.ts: ", error);
    throw error;
  }
}
