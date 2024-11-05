"use server";

import newClient from "../../utils/newClient";
import { NewsLetterEmailsData } from "../../../types/databaseTypes";

export default async function getNewsLetterEmails() {
  const database = newClient();

  try {
    const emailsData = database
      .prepare(
        `
        SELECT *
        FROM NewsLetterSubscriptionEmails
        `
      )
      .all() as NewsLetterEmailsData[];

    return emailsData;
  } catch (error) {
    throw error;
  }
}
