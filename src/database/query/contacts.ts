import getUUID from "@/shared/uuid";
import { getDb } from "../initialize";
import sql from "../sql";

export type ContactNumber = {
  number: string;
  platform: { whatsapp: boolean };
};

export type ContactsType = {
  id: string;
  created_at: number;
  updated_at: number;
  fullname: string;
  thumbnail: string;
  remarks: string;
  primary_number: ContactNumber;
  secondary_number: ContactNumber | null;
  tertiary_number: ContactNumber | null;
};

export type ContactsTypeRaw = {
  id: string;
  created_at: number;
  updated_at: number;
  fullname: string;
  thumbnail: string;
  remarks: string;
  primary_number: string;
  secondary_number: string | null;
  tertiary_number: string | null;
};

export async function getAllContacts() {
  const db = getDb();
  if (!db) {
    return null;
  }
  const result = await db.getAllAsync<ContactsType>(sql.contact.getAll);
  return result;
}
export async function getContactDetailsById(id: string): Promise<ContactsType | null> {
  const db = getDb();
  if (!db) {
    return null;
  }

  const result = await db.getFirstAsync<ContactsTypeRaw>(sql.contact.getById, [id]);

  if (!result) return null;

  return {
    ...result,
    primary_number: JSON.parse(result.primary_number) as ContactNumber,
    secondary_number: result.secondary_number
      ? (JSON.parse(result.secondary_number) as ContactNumber)
      : null,
    tertiary_number: result.tertiary_number
      ? (JSON.parse(result.tertiary_number) as ContactNumber)
      : null,
  };
}

export async function addContact(
  fullname: string,
  thumbnail: string,
  remarks: string | null,
  primary_number: ContactNumber,
  secondary_number: ContactNumber | null = null,
  tertiary_number: ContactNumber | null = null
) {
  const db = getDb();
  if (!db) {
    return null;
  }

  const id = getUUID();
  try {
    await db.runAsync(sql.contact.insert, [
      id,
      fullname,
      thumbnail,
      remarks,
      JSON.stringify(primary_number),
      secondary_number ? JSON.stringify(secondary_number) : null,
      tertiary_number ? JSON.stringify(tertiary_number) : null,
    ]);
  } catch (err) {
    console.log("Some error occured!", err);
  }
}
