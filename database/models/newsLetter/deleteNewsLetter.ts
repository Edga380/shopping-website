"use server";

import newClient from "../../utils/newClient";
import fs from "fs/promises";

export default async function deleteNewsLetter(id: number) {
  const database = newClient();

  try {
    const imagesToRemove = database
      .prepare(
        `
        SELECT image_path
        FROM NewsLetterSections
        WHERE news_letter_id = ?
        `
      )
      .all(id) as { image_path: string }[];

    database
      .prepare(
        `
        DELETE
        FROM NewsLetters
        WHERE id = ?
        `
      )
      .run(id);

    await Promise.all(
      imagesToRemove.map(async ({ image_path }) => {
        await fs.unlink(`public/newsLetters/${image_path}`);
      })
    );
  } catch (error) {
    throw error;
  }
}
