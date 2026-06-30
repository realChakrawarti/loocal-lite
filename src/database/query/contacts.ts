import getUUID from "@/shared/uuid";
import { getDb } from "../initialize";
import sql from "../sql";

type ContactNumber = {
  number: string;
  platform: { whatsapp: boolean };
};

export async function getAllContacts() {
  const db = getDb();
  if (!db) {
    return;
  }
  const result = await db.getAllAsync(sql.contact.getAll);
  return result;
}

export async function addContact(
  fullname: string,
  thumbnail: string,
  primary_number: ContactNumber,
  secondary_number: ContactNumber | null = null,
  tertiary_number: ContactNumber | null = null
) {
  const db = getDb();
  if (!db) {
    return;
  }

  const id = getUUID();
  try {
    await db.runAsync(sql.contact.insert, [
      id,
      fullname,
      thumbnail,
      JSON.stringify(primary_number),
      JSON.stringify(secondary_number),
      JSON.stringify(tertiary_number),
    ]);
  } catch (err) {
    console.error(JSON.stringify(err));
  }
}
