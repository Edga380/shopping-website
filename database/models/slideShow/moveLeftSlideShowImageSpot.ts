"use server";

import newClient from "../../utils/newClient";

export default async function moveLeftSlideShowImageSpot(
  imageId: number,
  imageSpot: number
) {
  const database = newClient();

  try {
    const result = database
      .prepare(
        `
        UPDATE SlideshowImages 
        SET image_spot = ? 
        WHERE image_spot = ?
        `
      )
      .run(imageSpot, imageSpot - 1);

    if (result.changes > 0) {
      database
        .prepare(
          `
          UPDATE SlideshowImages
          SET image_spot = ?
          WHERE image_id = ?
          `
        )
        .run(imageSpot - 1, imageId);
    }
  } catch (error) {
    console.error("Failed to move image spot: ", error);
    throw error;
  }
}
