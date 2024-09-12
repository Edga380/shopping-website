"use server";

import newClient from "../../utils/newClient";
import { hash } from "bcrypt";

export async function registerUser(
  username: string,
  email: string,
  password: string
) {
  const database = newClient();

  const hashedPassword = await hash(password, 10);

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
      .run(username, hashedPassword, email);

    return { success: true, message: "Registration successful." };
  } catch (error: any) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      if (error.message.includes("Users.username")) {
        return {
          success: false,
          message:
            "The Username is already in use. Please use a different Username.",
        };
      }
      if (error.message.includes("Users.email")) {
        return {
          success: false,
          message:
            "The Email address is already in use. Please use a different email.",
        };
      }
      return {
        success: false,
        message: "Something went wrong. Try again later.",
      };
    }
    throw error;
  }
}
