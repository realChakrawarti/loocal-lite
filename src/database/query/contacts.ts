import { getDb } from "../initialize";
import sql from "../sql";
import { createNanoidToken } from "@/shared/nanoid-token";
import { ContactNumber, ContactsType, ContactsTypeRaw, TagsType } from "../types";

export async function getAllContacts() {
  const db = getDb();
  if (!db) {
    return null;
  }
  const result = await db.getAllAsync<ContactsType>(sql.contact.getAll);
  return result;
}
export async function getContactDetailsById(
  id: string
): Promise<(ContactsType & { tags: TagsType[] | [] }) | null> {
  const db = getDb();

  if (!db) {
    return null;
  }

  const contactResult = await db.getFirstAsync<ContactsTypeRaw>(sql.contact.getById, [id]);

  if (!contactResult) return null;

  let tagResult: TagsType[] = [];
  try {
    tagResult = await db.getAllAsync<TagsType>(sql.contactTag.getById, [id]);
  } catch (err) {
    console.log("Something went wrong", err);
  }

  const data = {
    ...contactResult,
    primary_number: JSON.parse(contactResult.primary_number) as ContactNumber,
    secondary_number: contactResult.secondary_number
      ? (JSON.parse(contactResult.secondary_number) as ContactNumber)
      : null,
    tertiary_number: contactResult.tertiary_number
      ? (JSON.parse(contactResult.tertiary_number) as ContactNumber)
      : null,
    tags: tagResult,
  };

  return data;
}

export async function updateContact(
  id: string,
  fullname: string,
  thumbnail: string,
  remarks: string | null,
  primary_number: ContactNumber,
  secondary_number: ContactNumber | null = null,
  tertiary_number: ContactNumber | null = null,
  tags: TagsType[]
) {
  const db = getDb();
  if (!db) {
    return null;
  }

  try {
    await db.runAsync(sql.contact.update, [
      fullname,
      thumbnail,
      remarks,
      JSON.stringify(primary_number),
      secondary_number ? JSON.stringify(secondary_number) : null,
      tertiary_number ? JSON.stringify(tertiary_number) : null,
      id,
    ]);

    if (tags.length) {
      await Promise.all(tags.map((tag) => db.runAsync(sql.contactTag.insert, [id, tag.id])));
    }
  } catch (err) {
    console.log("Some error occured!", err);
  }
}

export async function filterContactByTags(tagIds: string[]) {
  const db = getDb();
  if (!db) {
    return null;
  }

  console.log("QueryRAN", sql.contactTag.filterByTag(tagIds));
  try {
    const results = await db.getAllAsync<ContactsType>(sql.contactTag.filterByTag(tagIds));
    console.log("<<<<<<<<<<<<<Data", results)
    return results;
  } catch (err) {
    console.log("Some error occured!", err);
  }
}

export async function addContact(
  fullname: string,
  thumbnail: string,
  remarks: string | null,
  primary_number: ContactNumber,
  secondary_number: ContactNumber | null = null,
  tertiary_number: ContactNumber | null = null,
  tags: TagsType[]
) {
  const db = getDb();
  if (!db) {
    return null;
  }

  const id = createNanoidToken("contact");
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

    if (tags.length) {
      await Promise.all(tags.map((tag) => db.runAsync(sql.contactTag.insert, [id, tag.id])));
    }
  } catch (err) {
    console.log("Some error occured!", err);
  }
}
