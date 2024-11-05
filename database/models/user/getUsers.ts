"use server";

import { UserData } from "../../../types/databaseTypes";
import newClient from "../../utils/newClient";

export default async function getUsers() {
  const database = newClient();

  try {
    const users = database
      .prepare(
        `
        SELECT user_id, username, email, created_at
        FROM Users
        `
      )
      .all() as UserData[];

    return users;
  } catch (error) {
    throw error;
  }
}
