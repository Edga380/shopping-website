import Database from "better-sqlite3";
import { join } from "path";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

function initializeDatabase(databaseName: string, dbSchema: string) {
  if (!databaseName) {
    throw new Error("Database name is not defined.");
  }

  const databaseFilePath = join(process.cwd(), "database", databaseName);
  const schemaPath = join(process.cwd(), "database", dbSchema);

  const database = new Database(databaseFilePath);

  const schema = fs.readFileSync(schemaPath, "utf-8");
  database.exec(schema);

  console.log("Database initialized.");
  return database;
}

export { initializeDatabase };
