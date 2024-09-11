"use server";

import newClient from "../../utils/newClient";

export default async function addSubmission(formData: FormData) {
  const database = newClient();

  const data = Object.fromEntries(formData);

  try {
    const result = database
      .prepare(
        `
        INSERT
        INTO ContactUsSubmissions
            (full_name, email, subject, message, replied)
        VALUES 
            (?, ?, ?, ?, ?)
      `
      )
      .run(data.fullname, data.email, data.subject, data.message, "false");

    if (result.changes > 0) {
      return {
        success: true,
        message:
          "Your submission was successfully sent. Our team will contact you soon.",
        color: "green",
      };
    }

    return { success: false, message: "Your submission failed.", color: "red" };
  } catch (error) {
    console.error("Failed in addSubmission.ts", error);
    throw error;
  }
}
