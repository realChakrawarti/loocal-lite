import { ContactNumber, TagsType } from "@/database/types";
import {
  AnyParameter,
  VCARD,
  CategoriesProperty,
  FNProperty,
  NoteProperty,
  ParameterValueType,
  PhotoProperty,
  TelProperty,
  TextListType,
  TextType,
  parse,
  URIType,
  NProperty,
  SpecialValueType,
  ExtendedProperty,
} from "vcard4";

import * as Sharing from "expo-sharing";
import { File, Paths } from "expo-file-system";

type CreateVCardArgs = {
  fullname: string;
  thumbnail: string;
  phones: ContactNumber[];
  remarks: string;
  tags: TagsType[];
};

function createVCard({ fullname, thumbnail, phones, remarks, tags }: CreateVCardArgs) {
  const properties: any[] = [];

  // 1. Full Name
  properties.push(new FNProperty([], new TextType(fullname)));

  // 2. First name, last name
  const [firstName, ...lastName] = fullname.split(" ");

  const nameArray = Array.from({ length: 5 });
  if (lastName.length) {
    nameArray[0] = new TextType(lastName.join(" "));
  }
  nameArray[1] = new TextType(firstName);
  const name = new NProperty([], new SpecialValueType("NProperty", nameArray));

  properties.push(name);

  // TODO: Optionally attach image, when shared via QR (No) vs shared as .vcf (Yes?)
  // if (thumbnail) {
  //   properties.push(new PhotoProperty([], new URIType(thumbnail)));
  // }

  // 3. Phone numbers
  phones.forEach((phone) => {
    const tel = new TelProperty([], new TextType(phone.number));
    properties.push(tel);
  });

  // 4. Remarks
  if (remarks) {
    properties.push(new NoteProperty([], new TextType(remarks)));
  }

  // 5. Tags
  if (tags.length) {
    const categoryList = new TextListType(tags.map((tag) => new TextType(tag.name)));
    properties.push(new CategoriesProperty([], categoryList));
  }

  // 6. Custom Loocal specific JSON
  const customJSON = {
    tags: tags.map((tag) => tag.name),
    phones: phones.map((phone) => ({ whatsapp: phone.platform.whatsapp, number: phone.number })),
  };

  properties.push(new ExtendedProperty("X-LOOCAL", [], new TextType(JSON.stringify(customJSON))));

  return new VCARD(properties).repr();
}

function parseVCard(contact: string) {
  return parse(contact);
}

async function shareVCard(vCardString: string, name: string = "contact") {
  const vCard3 = vCardString.replace(/VERSION:4\.0/, "VERSION:3.0");
  const isAvailable = await Sharing.isAvailableAsync();
  if (!isAvailable) {
    alert("Sharing is not available on this device");
    return;
  }

  const file = new File(Paths.cache, `${name}.vcf`);
  if (!file.exists) {
    file.create();
  }
  file.write(vCard3);

  try {
    await Sharing.shareAsync(file.uri, {
      mimeType: "text/vcard",
      dialogTitle: "Share Contact",
      UTI: "public.vcard",
    });
  } catch (error) {
    alert(error);
  } finally {
    if (file.exists) {
      file.delete();
    }
  }
}

export { createVCard, parseVCard, shareVCard };
