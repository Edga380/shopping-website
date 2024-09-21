"use server";

import newClient from "../../utils/newClient";
import dotenv from "dotenv";
dotenv.config();
import sgMail from "@sendgrid/mail";

export default async function subscribeNewsLetter(email: string) {
  const database = newClient();

  if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  } else {
    return {
      success: false,
      message: "Subscribe to our NewsLetter now accessible.",
      color: "green",
    };
  }

  try {
    database
      .prepare(
        `
            INSERT
            INTO NewsLetterSubscriptionEmails (news_letter_subscription_email)
            VALUES (?)
            `
      )
      .run(email);

    const message = {
      to: email,
      from: "edgatesting44@gmail.com",
      subject: "NewsLetter subscription confirmation",
      html: `
            <div>
              <h1>Subscription Confirmed!</h1>
              <p>Hi there,</p>
              <p>We are happy to confirm that you have successfully subscribed to our newsletter. You will now receive the latest updates, news, and special offers directly in your inbox!</p>
              <a href="#">Visit Our Website</a>
              <div>
                <p>Thank you for joining us!</p>
              </div>
          `,
    };

    await sgMail.send(message);

    return {
      success: true,
      message: "Subscribed to our NewsLetter. Email confirmation sent.",
      color: "green",
    };
  } catch (error: any) {
    console.error(error);
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return {
        success: false,
        message: "Email already being used.",
        color: "red",
      };
    }
    return {
      success: false,
      message: "Something went wrong.",
      color: "red",
    };
  }
}
