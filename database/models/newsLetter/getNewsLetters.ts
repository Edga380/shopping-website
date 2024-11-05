"use server";

import { getNewsLetterSections } from "../../../types/databaseTypes";
import newClient from "../../utils/newClient";

export default async function getNewsLetters() {
  const database = newClient();

  try {
    const newsLetters = database
      .prepare(
        `
        SELECT nl.*,
        JSON_GROUP_ARRAY(
            JSON_OBJECT(
            'section', (
                SELECT 
                    JSON_GROUP_ARRAY(
                        JSON_OBJECT(
                        'title', nls.title,
                        'image_path', nls.image_path,
                        'message', nls.message,
                        'button_link', nls.button_link,
                        'button_name', nls.button_name
                        )
                    )
                    FROM NewsLetterSections nls WHERE nls.news_letter_id = nl.id
                )
            )
        ) as sections
        FROM NewsLetters nl
        WHERE nl.id IS NOT NULL
        GROUP BY nl.id
        ORDER BY nl.created_at DESC
        `
      )
      .all() as {
      id: number;
      subject: string;
      created_at: string;
      sections: string;
    }[];

    const parseNewsLetters = newsLetters.map((newsLetter) => ({
      ...newsLetter,
      sections: JSON.parse(newsLetter.sections),
    })) as getNewsLetterSections[];

    return parseNewsLetters;
  } catch (error) {
    throw error;
  }
}
