"use server";

import { cookies } from "next/headers";
import newClient from "../../utils/newClient";

export default async function logoutUser(userId: number) {
  const database = newClient();

  try {
    const result = database
      .prepare(
        `
            UPDATE Users
            SET session_cookie_id = ?, auth_cookie_id = ?, auth_cookie_created_at = ?
            WHERE user_id = ?
            `
      )
      .run(null, null, null, userId);

    if (result.changes > 0) {
      const cookieNames = [
        "DoDoirSeSe-Session-Cookie",
        "DoDoirSeSe-Auth-Cookie",
      ];

      cookieNames.forEach((name) => cookies().delete(name));
    }

    return { success: true };
  } catch (error) {
    console.error("Error in logoutUser:", error);
    return { success: false, message: "Failed to logout user." };
  }
}
