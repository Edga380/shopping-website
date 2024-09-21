"use server";

import newClient from "../../utils/newClient";
import dotenv from "dotenv";
dotenv.config();
import sgMail from "@sendgrid/mail";
import {
  NewsLetterEmailsData,
  NewsLetterSection,
} from "../../../types/databaseTypes";

export default async function sendNewsLetter(
  emailsData: NewsLetterEmailsData[] | undefined,
  subject: string,
  sections: NewsLetterSection[]
) {
  const database = newClient();

  if (!emailsData) {
    return {
      success: false,
      message: "There is no emails to send newsletter to.",
      color: "red",
    };
  }

  if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  } else {
    return {
      success: false,
      message: "Sendgrid services not available at the momment.",
      color: "red",
    };
  }

  let assembleHtml = ``;

  sections.forEach((section) => {
    if (section.imageUrl) {
      assembleHtml += `<img src="${section.imageUrl}" alt="image not found" style="width: 600px"/>`;
    }
    if (section.title) {
      assembleHtml += `<h2 style="padding: 20px 0 0 0; color: #333333; font-size: 20px;">${section.title}</h2>`;
    }
    if (section.message) {
      assembleHtml += `<p style="padding: 10px 20px 10px 20px; color: #555555; line-height: 1.6; font-size: 16px;">${section.message}</p>`;
    }
    if (section.buttonLink) {
      assembleHtml += `<p style="margin-top: 20px;">
                      <a href="${section.buttonLink}"
                        style="display: inline-block; background-color: #d9988d; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">${
                          section.buttonName ? section.buttonName : "More"
                        }</a>
                  </p>`;
    }
  });

  const emailMessageData = {
    to: "",
    from: "edgatesting44@gmail.com",
    subject: subject,
    html: `
        <center>
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #dddddd;">

              <!-- Logo Section -->
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs50tQXbmy1sghOyjzYhg2yOjzO40hK7XR0g&s" alt="image not found" style="width: 600px"/>

              <!-- Main Content Section -->
              ${assembleHtml}

              <!-- Footer Section -->
              <div style="text-align: center; padding: 10px; font-size: 12px; color: #888888;">
                  <p style="margin: 0;">You're receiving this email because you subscribed to our newsletter.</p>
                  <p style="margin: 0;">If you no longer wish to receive these emails, you can <a href="[Unsubscribe Link]" style="color: #d9988d; text-decoration: none;">unsubscribe here</a>.</p>
                  <p style="margin: 0;">&copy; ${new Date().getFullYear()} DoDo ir SeSe. All rights reserved.</p>
              </div>

              </div>
          </center>
          `,
  };

  const transaction = database.transaction(async () => {
    try {
      const result = database
        .prepare(
          `
            INSERT 
            INTO NewsLetters
              (subject)
            VALUES
              (?)
            `
        )
        .run(subject);

      sections.forEach((section) => {
        database
          .prepare(
            `
              INSERT
              INTO NewsLetterSections
                (news_letter_id, image_url, title, message, button_link, button_name)
              VALUES (?, ?, ?, ?, ?, ?)
              `
          )
          .run(
            result.lastInsertRowid,
            section.imageUrl,
            section.title,
            section.message,
            section.buttonLink,
            section.buttonName
          );
      });

      emailsData.forEach(async (email) => {
        await sgMail.send({
          ...emailMessageData,
          to: email.news_letter_subscription_email,
        });
      });
    } catch (error) {
      console.error("Error inside sendNewsLetter.ts: ", error);
      return {
        success: false,
        message: "Something went wrong while sending the newsletter.",
        color: "red",
      };
    }
  });

  transaction();

  return {
    success: true,
    message: "NewsLetter sent successfully.",
    color: "green",
  };
}
