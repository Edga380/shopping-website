"use server";

import newClient from "../../utils/newClient";

export default async function addColor(color: string) {
  const database = newClient();

  try {
    database
      .prepare(
        `
        INSERT
        INTO ProductColor
            (color)
        VALUES 
            (?)
        `
      )
      .run(color);
  } catch (error) {
    console.error("Error inside addColor.ts: ", error);
  }
}
