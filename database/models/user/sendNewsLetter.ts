"use server";

import newClient from "../../utils/newClient";
import { headers } from "next/headers";
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
  sections: NewsLetterSection[],
  imageFilesFormData: FormData
) {
  if (emailsData === undefined || emailsData.length === 0) {
    throw new Error("Empty 'emailsData' variable.");
  }

  const database = newClient();

  const getHeaders = headers();

  const protocol = getHeaders.get("x-forwarded-proto");

  const host = getHeaders.get("host");

  const origin = `${protocol}://${host}/public/newsLetters/`;

  const storedImages: { imageId: number; imageFile: File }[] = [];

  Object.entries(Object.fromEntries(imageFilesFormData.entries())).forEach(
    ([key, value]) => {
      const imageId = Number(key.split("-")[1]) as number;
      const imageFile = value as File;
      storedImages.push({ imageId, imageFile });
    }
  );

  if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  } else {
    throw new Error("Can't connect to 'sendGrid' services.");
  }

  let assembleHtml = ``;

  sections.forEach((section) => {
    let imageName: string = "";

    storedImages.forEach((storedImage) => {
      if (storedImage.imageId === section.sectionId) {
        imageName = storedImage.imageFile.name;
      }
    });
    if (imageName) {
      assembleHtml += `<img src="${origin}${imageName}" alt="image not found" style="width: 600px"/>`;
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

  const insertNewsLetterData = database.transaction(async () => {
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
      let imageName: string = "";

      storedImages.forEach((storedImage) => {
        if (storedImage.imageId === section.sectionId) {
          imageName = storedImage.imageFile.name;
        }
      });

      database
        .prepare(
          `
              INSERT
              INTO NewsLetterSections
                (news_letter_id, image_path, title, message, button_link, button_name)
              VALUES (?, ?, ?, ?, ?, ?)
              `
        )
        .run(
          result.lastInsertRowid,
          imageName,
          section.title,
          section.message,
          section.buttonLink,
          section.buttonName
        );
    });
  });

  try {
    insertNewsLetterData();

    emailsData.forEach(async (email) => {
      await sgMail.send({
        ...emailMessageData,
        to: email.news_letter_subscription_email,
      });
    });
  } catch (error) {
    throw error;
  }
}
