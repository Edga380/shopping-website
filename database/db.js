const Database = require("better-sqlite3");
const { join } = require("path");
const fs = require("fs");
require("dotenv").config();

function initializeDatabase(databaseName, dbSchema) {
  const dbName = databaseName;
  if (!dbName) {
    throw new Error("dbName if not defined.");
  }

  const dbFilePath = join(process.cwd(), "database", dbName);
  const schemaPath = join(process.cwd(), "database", dbSchema);

  const db = new Database(dbFilePath);

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

async function addProductDB(formData) {
  console.log(formData);
  const statement = productsDb.prepare(
    "INSERT INTO Products (name, description, category, priceInPennies, stock, isAvailable) VALUES (?, ?, ?, ?, ?, ?)"
  );
  try {
    const result = statement.run(
      "formData.name",
      "formData.description",
      "formData.category",
      20,
      12,
      "formData.isAvailable"
    );
    console.log("Product added successfully: ", result);
    return true;
  } catch (error) {
    console.error("Failed to add product: ", error);
    return false;
  }
}

module.exports = { usersDb, productsDb, addProductDB };
