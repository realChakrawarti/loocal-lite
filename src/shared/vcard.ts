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
  // TypeParameter,
  URIType,
} from "vcard4";

type CreateVCardArgs = {
  fullname: string;
  thumbnail: string;
  phones: ContactNumber[];
  remarks: string;
  tags: TagsType[];
};

const phoneMaps = new Map([
  ["1", "Primary"],
  ["2", "Secondary"],
  ["3", "Tertiary"],
]);

function createVCard({ fullname, thumbnail, phones, remarks, tags }: CreateVCardArgs) {
  const properties: any[] = [];

  // 1. Full Name (FN) - Required
  properties.push(new FNProperty([], new TextType(fullname)));

  // 2. Photo (PHOTO)
  if (thumbnail) {
    // Using URIType is valid for vCard 4.0 if the client supports remote images.
    // If compatibility is an issue, convert the image to a Base64 Data URI string first.
    properties.push(new PhotoProperty([], new URIType(thumbnail)));
  }

  // phone numbers
  phones.forEach((phone, idx) => {
    const params: AnyParameter[] = [];

    // Determine the label (Primary, Secondary, etc.)
    const label = phoneMaps.get(`${idx + 1}`);

    // vcard4 requires a separate TypeParameter instance for each type value
    // Add the label type (e.g., "Primary number" or "Home")
    // params.push(new TypeParameter("TelProperty", new ParameterValueType(label)));

    // // Add the "voice" type
    // params.push(new TypeParameter("TelProperty", new ParameterValueType("voice")));

    // Add custom WhatsApp parameter if present
    if (phone.platform.whatsapp) {
      params.push(new AnyParameter("X-WHATSAPP", new ParameterValueType("TRUE")));
    }

    // Create TelProperty with the flat array of parameters
    // Note: Ensure phone.number is a string. If it's a URI, use URIType, otherwise TextType is standard for TEL in v4.
    // properties.push(new TelProperty(params, new TextType(phone.number)));

    const telHome = new TelProperty(
      [new AnyParameter(`X-${label}`, new ParameterValueType(phone.number))],
      new URIType(`tel:${phone.number}`)
    );
    properties.push(telHome);
  });

  // 4. Remarks (NOTE)
  if (remarks) {
    properties.push(new NoteProperty([], new TextType(remarks)));
  }

  // 5. Tags (CATEGORIES)
  if (tags.length) {
    const categoryList = new TextListType(tags.map((tag) => new TextType(tag.name)));
    properties.push(new CategoriesProperty([], categoryList));
  }

  // Generate the vCard string
  return new VCARD(properties).repr();
}

function parseVCard(contact: string) {
  return parse(contact);
}

export { createVCard, parseVCard };
