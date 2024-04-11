const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

function initializeDatabase(databaseName, dbSchema) {
  const dbName = databaseName;
  if (!dbName) {
    throw new Error("dbName if not defined.");
  }
  const dbFilePath = path.join(__dirname, dbName);
  const db = new Database(dbFilePath);

  const schemaPath = path.join(__dirname, dbSchema);
  const schema = fs.readFileSync(schemaPath, "utf-8");

  db.exec(schema);

  console.log("Database initialized.");
  return db;
}

const usersDb = initializeDatabase(
  process.env.USERS_DATABASE,
  "createUserDb.sql"
);
const productsDb = initializeDatabase(
  process.env.PRODUCTS_DATABASE,
  "products.sql"
);

async function userData() {
  const statement = usersDb.prepare("SELECT * FROM Users");
}

module.exports = { usersDb, productsDb };
