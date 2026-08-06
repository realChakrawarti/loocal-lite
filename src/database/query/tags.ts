import { createNanoidToken } from "@/shared/nanoid-token";
import { getDb } from "../initialize";
import sql from "../sql";
import { TagsType } from "../types";

export async function getAllTags() {
  const db = getDb();
  if (!db) {
    return null;
  }
  const result = await db.getAllAsync<TagsType>(sql.tag.getAll);
  return result;
}

export async function addTag(name: string) {
  const db = getDb();
  if (!db) {
    return null;
  }

  const tagId = createNanoidToken("tag");

  try {
    await db.runAsync(sql.tag.insert, [tagId, name]);
  } catch (err) {
    console.log("Some error occured!", err);
  }
}

export async function deleteTagById(tagId: string) {
  const db = getDb();
  if (!db) {
    return null;
  }

  try {
    await db.runAsync(sql.tag.deleteById, [tagId]);
  } catch (err) {
    console.log("Some error occured!", err);
  }
}

export async function getTagsByContactId(contactId: string) {
  const db = getDb();
  if (!db) {
    return null;
  }

  try {
    await db.getAllAsync(sql.contactTag.getById, [contactId]);
  } catch (err) {
    console.log("Some error occured!", err);
  }
}

export async function removeTagFromContact(contactId: string, tagId: string) {
  const db = getDb();
  if (!db) {
    return null;
  }

  try {
    await db.runAsync(sql.contactTag.deleteById, [contactId, tagId]);
  } catch (err) {
    console.log("Some error occured!", err);
  }
}
