"use server";

import newClient from "../../utils/newClient";

export default async function updateReplied(id: string, replied: boolean) {
  const database = newClient();

  try {
    database
      .prepare(
        `
        UPDATE ContactUsSubmissions
        SET replied = ?
        WHERE contact_form_id = ?
        `
      )
      .run(replied.toString(), id);
  } catch (error) {
    throw error;
  }
}
