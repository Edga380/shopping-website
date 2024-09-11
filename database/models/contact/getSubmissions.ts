"use server";

import { ContactUsSubmissions } from "../../../types/databaseTypes";
import newClient from "../../utils/newClient";

export default async function getSubmissions() {
  const database = newClient();

  try {
    const data = database
      .prepare(
        `
          SELECT *
          FROM ContactUsSubmissions
          ORDER BY created_at DESC
          `
      )
      .all() as ContactUsSubmissions[];

    return data;
  } catch (error) {
    throw error;
  }
}
