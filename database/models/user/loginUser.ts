"use server";

import { cookies } from "next/headers";
import { UserData } from "../../../types/databaseTypes";
import newClient from "../../utils/newClient";
import bcrypt from "bcrypt";

type userInputDataProps = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export default async function loginUser(userInputData: userInputDataProps) {
  const database = newClient();

  try {
    const { password, ...userData } = database
      .prepare(
        `
        SELECT *
        FROM Users
        WHERE email = ?
        `
      )
      .get(userInputData.email) as UserData;

    if (!userData) {
      return {
        success: false,
        data: null,
        message: "Email or password incorrect.",
      };
    }

    const comparePasswords = await bcrypt.compare(
      userInputData.password,
      password
    );

    if (!comparePasswords) {
      return {
        success: false,
        data: null,
        message: "Email or password incorrect.",
      };
    }

    const randomCookieId = await bcrypt.hash(userInputData.email, 10);

    const cookieOptions = {
      httpOnly: true,
      path: "/",
      secure: true,
      sameSite: "strict" as const,
    };

    if (userInputData.rememberMe) {
      const result = database
        .prepare(
          `
          UPDATE Users
          SET auth_cookie_id = ?, auth_cookie_created_at = ?
          WHERE user_id = ?
          `
        )
        .run(randomCookieId, new Date().toISOString(), userData.user_id);

      if (result.changes > 0) {
        cookies().set({
          name: "DoDoirSeSe-Auth-Cookie",
          value: randomCookieId,
          ...cookieOptions,
          maxAge: 2592000, // 30days
        });
      }

      return {
        success: true,
        data: userData,
        message: "",
      };
    } else {
      const result = database
        .prepare(
          `
          UPDATE Users
          SET session_cookie_id = ?
          WHERE user_id = ?
          `
        )
        .run(randomCookieId, userData.user_id);

      if (result.changes > 0) {
        cookies().set({
          name: "DoDoirSeSe-Session-Cookie",
          value: randomCookieId,
          ...cookieOptions,
          maxAge: 14400, // 4hours
        });

        return {
          success: true,
          data: userData,
          message: "",
        };
      }
    }

    return {
      success: false,
      data: null,
      message: "Something went wrong.",
    };
  } catch (error) {
    console.error("Error in loginUser:", error);
    return {
      success: false,
      data: null,
      message: "An unexpected error occured.",
    };
  }
}
