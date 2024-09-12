"use server";

import { hash } from "bcrypt";
import newClient from "../../utils/newClient";
import { UserData } from "../../../types/databaseTypes";

export default async function resetPassword(
  email: string,
  password: string,
  token: string
) {
  const database = newClient();

  try {
    const { resetPasswordToken, resetPasswordExpires } = (await database
      .prepare(
        `
        SELECT resetPasswordToken, resetPasswordExpires
        FROM Users
        WHERE email = ?
        `
      )
      .get(email)) as UserData;

    if (resetPasswordToken !== token) {
      return {
        success: false,
        message: "Token does not match.",
        color: "red",
      };
    } else if (new Date(resetPasswordExpires) < new Date()) {
      return {
        success: false,
        message: "Token expired.",
        color: "red",
      };
    }

    const hashedPassword = await hash(password, 10);

    const result = database
      .prepare(
        `
        UPDATE Users
        SET password = ?
        WHERE email = ? AND resetPasswordToken = ?
        `
      )
      .run(hashedPassword, email, token);

    if (result.changes > 0) {
      return {
        success: true,
        message: "Succesful, now you can login.",
        color: "green",
      };
    } else {
      return {
        success: false,
        message: "Could not save new password, try again.",
        color: "red",
      };
    }
  } catch (error) {
    throw error;
  }
}
