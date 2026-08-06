// References: https://github.com/ai/nanoid/blob/main/index.browser.js

import * as crypto from "expo-crypto";
const tokenCharacters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export let customRandom = (alphabet: string, defaultSize: number = 21) => {
  let safeByteCutoff = 256 - (256 % alphabet.length);

  if (safeByteCutoff === 256) {
    let mask = alphabet.length - 1;

    return (size = defaultSize) => {
      if (!size) return "";
      let id = "";
      while (true) {
        let bytes = crypto.getRandomValues(new Uint8Array(size));
        let j = size;
        while (j--) {
          id += alphabet[bytes[j] & mask];
          if (id.length >= size) return id;
        }
      }
    };
  }

  let step = Math.ceil((1.6 * 256 * defaultSize) / safeByteCutoff);

  return (size = defaultSize) => {
    if (!size) return "";
    let id = "";
    while (true) {
      let bytes = crypto.getRandomValues(new Uint8Array(step));
      let j = step;
      while (j--) {
        if (bytes[j] < safeByteCutoff) {
          id += alphabet[bytes[j] % alphabet.length];
          if (id.length >= size) return id;
        }
      }
    }
  };
};

type PrefixType = "tag" | "contact" | "location" | "chat";

/**
 * Generates a unique token using a custom nanoid alphabet.
 *
 * @param length - The desired length of the generated token
 * @returns A unique random string token of specified length
 */
export function createNanoidToken(prefix: PrefixType, length: number = 6): string {
  const nanoid = customRandom(tokenCharacters, length);
  return prefix + "_" + nanoid();
}
