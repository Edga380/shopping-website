"use server";

import newClient from "../../utils/newClient";
import fs from "fs/promises";

export default async function deleteSlideShowImage(
  imageId: number,
  path: string
) {
  const database = newClient();

  try {
    const result = database
      .prepare(
        `
        DELETE
        FROM SlideshowImages
        WHERE image_id = ? AND path = ?
        `
      )
      .run(imageId, path);

    if (result) {
      await fs.unlink(`public/slideShow/${path}`);
    }
  } catch (error) {
    console.error("Failed to delete slide show image: ", error);
    throw error;
  }
}
