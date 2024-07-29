"use server";

import newClient from "../../utils/newClient";
import fs from "fs/promises";
import { join, dirname } from "path";

export default async function addSlideShowImage(
  imageSpot: number,
  formData: FormData
) {
  const database = newClient();
  const imageData = formData.get("image") as File;

  try {
    const result = database
      .prepare(
        `
        INSERT
        INTO SlideshowImages
            (image_spot, path)
        VALUES (?, ?)
        `
      )
      .run(imageSpot, imageData.name);

    if (result) {
      const imageBuffer = await imageData.arrayBuffer();
      const filePath = join("public", "slideShow", imageData.name);
      await fs.mkdir(dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, Buffer.from(imageBuffer));
    }
  } catch (error) {
    console.error("Failed to add slide show image: ", error);
    throw error;
  }
}
