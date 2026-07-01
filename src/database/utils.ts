import { getDb } from "./initialize";
import { deleteDatabaseSync } from "expo-sqlite";

export async function getAllTableNames() {
  const db = getDb();
  if (!db) {
    return;
  }

  const result = await db.getAllAsync<{ name: string }>(
    `SELECT name FROM sqlite_master WHERE type='table'`
  );
  return result.map((row) => row.name);
}

export function resetDatabaseSync(databaseName: string) {
  deleteDatabaseSync(databaseName);
}
