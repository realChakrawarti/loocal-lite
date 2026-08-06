import * as Crypto from "expo-crypto";

export default function getUUID() {
  const uuid = Crypto.randomUUID();
  return uuid;
}
