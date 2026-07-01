import { openDatabaseSync, type SQLiteDatabase } from "expo-sqlite";
import createTables from "./tables";
import logger from "@/shared/logger";
import { DATABASE_NAME } from "@/shared/constants";

let db: SQLiteDatabase | null = null;

function setupDb(): SQLiteDatabase | null {
  try {
    if (db) {
      return db;
    } else {
      db = openDatabaseSync(DATABASE_NAME);
      db.execSync("PRAGMA journal_mode = WAL;");
      db.execSync("PRAGMA foreign_keys = ON;");
      logger.info("Database is open and is on path: ", db.databasePath);
      createTables(db);
      return db;
    }
  } catch (err) {
    logger.error("Unable to open database connection", err);
    return null;
  }
}

function getDb(): SQLiteDatabase | null {
  if (!db) {
    const newDbInstance = setupDb();
    if (!newDbInstance) {
      logger.error("Unable to intialize db instance");
      return null;
    }
  }
  return db;
}

export { setupDb, getDb, createTables };
