"use server";

import newClient from "../../utils/newClient";
import bcrypt from "bcrypt";

export async function RegisterUser(email: string, password: string) {
  const database = newClient();

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    database
      .prepare(
        `
        INSERT
        INTO Users
            (username, password, email)
        VALUES (?, ?, ?)
        `
      )
      .run("Unknown", hashedPassword, email);

    return { success: true, message: "User registered successfully." };
  } catch (error) {
    console.error("Failed to register new user: ", error);
    throw error;
  }
}
