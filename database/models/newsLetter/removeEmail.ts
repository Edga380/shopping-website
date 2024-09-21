"use server";
import newClient from "../../utils/newClient";

export default async function removeEmail(id: number) {
  const database = newClient();

  try {
    database
      .prepare(
        `
            DELETE 
            FROM NewsLetterSubscriptionEmails
            WHERE news_letter_subscription_id = ?
            `
      )
      .run(id);

    return {
      success: true,
      message: "Email successfully removed.",
      color: "green",
    };
  } catch (error) {
    console.error("Error inside nesLetter/removeEmail.ts: ", error);
    return {
      success: false,
      message: "Could not remove email, something went wrong.",
      color: "red",
    };
  }
}
