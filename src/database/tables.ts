import type { SQLiteDatabase } from "expo-sqlite";
import sql from "./sql";
import logger from "@/shared/logger";

export default function tables(db: SQLiteDatabase) {
  try {
    db.execSync(sql.location.init);
    db.execSync(sql.contact.init);
  } catch (err) {
    logger.error("Failed to create tables", JSON.stringify(err, null, 2));
  }
}
