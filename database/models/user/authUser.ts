"use server";

import { cookies } from "next/headers";
import newClient from "../../utils/newClient";
import { UserData } from "../../../types/databaseTypes";

export default async function authUser() {
  const database = newClient();

  try {
    const allCookies = cookies().getAll();

    const cookieOptions = {
      "DoDoirSeSe-Session-Cookie": "session_cookie_id",
      "DoDoirSeSe-Auth-Cookie": "auth_cookie_id",
    };

    for (const [cookieName, column] of Object.entries(cookieOptions)) {
      const foundCookie = allCookies.find(
        (cookie) => cookie.name === cookieName
      );

      if (foundCookie) {
        const cookieId = foundCookie.value;

        if (cookieId) {
          const userData = database
            .prepare(
              `
              SELECT user_id, email, username, created_at
              FROM Users
              WHERE ${column} = ?
              `
            )
            .get(cookieId) as UserData;

          return userData;
        }
      }
    }
  } catch (error) {
    throw error;
  }
}
