"use server";

import newClient from "../../utils/newClient";
import { SlideShowImages } from "../../../types/databaseTypes";

export async function getSlideShowImages(): Promise<SlideShowImages[]> {
  const database = newClient();
  try {
    const slideShowImages = database
      .prepare(
        `
        SELECT * 
        FROM SlideshowImages
        `
      )
      .all() as SlideShowImages[];

    return slideShowImages;
  } catch (error) {
    console.error(`Error getting products:`, error);
    throw error;
  }
}
