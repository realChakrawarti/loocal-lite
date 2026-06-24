import getUUID from "@/shared/uuid";
import { getDb } from "../initialize";
import sql from "../sql";

type Params = {
  digipin: string;
  latitude: number;
  longitude: number;
  title: string;
  description: string;
};

export async function addLocation({ digipin, latitude, longitude, title, description }: Params) {
  const db = getDb();
  if (!db) {
    return;
  }

  const id = getUUID();
  await db.runAsync(sql.location.insert, [id, digipin, latitude, longitude, title, description]);
}

export async function getAllLocations() {
  const db = getDb();
  if (!db) {
    return;
  }
  const result = await db.getAllAsync(sql.location.getAll);
  return result;
}

export async function deleteAllLocations() {
  const db = getDb();
  if (!db) {
    return;
  }
  await db.execAsync(sql.location.deleteAll);
}
