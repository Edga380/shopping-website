import { Database } from "better-sqlite3";
import { initializeDatabase } from "../database";
import dotenv from "dotenv";

dotenv.config();

let database: Database | null = null;

export default function newClient(): Database {
  if (database === null) {
    if (!process.env.MAIN_DATABASE) {
      throw new Error(
        "the 'MAIN_DATABASE' environment variable is missing. Please set it in your .env file."
      );
    }

    database = initializeDatabase(process.env.MAIN_DATABASE, "database.sql");
  }

  return database;
}
