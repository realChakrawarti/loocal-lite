import contactStore from "@/store/contact-store";
import { regex } from "arkregex";
import { ExistingPhone } from "expo-contacts";
import EditContactForm from "./edit-contact-form";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { getContactDetailsById } from "@/database/query";
import { ContactNumber } from "@/database/types";

function normalizePhoneNumber(phone: string) {
  const phoneRegex = regex("^(?:\\+91|0)?([6-9]\\d{9})$");
  const removedWhiteSpace = phone.replaceAll(" ", "");

  if (phoneRegex.test(removedWhiteSpace)) {
    const nationalNumber = removedWhiteSpace.match(phoneRegex);
    return nationalNumber?.at(1);
  }
  return removedWhiteSpace;
}

function uniquePhoneNumbers(phones: ExistingPhone[]) {
  const numbers: string[] = [];

  if (!phones.length) {
    console.log("Empty phones");
    return numbers;
  }

  phones.forEach((phone) => {
    const normalizedPhone = normalizePhoneNumber(phone.number || "");
    if (normalizedPhone && !numbers.includes(normalizedPhone)) {
      return numbers.push(normalizedPhone);
    }
  });

  return numbers;
}

function phones(phones: ExistingPhone[] | undefined): ContactNumber[] {
  if (!phones) return [{ number: "", platform: { whatsapp: false } }];

  const phoneNumbers = uniquePhoneNumbers(phones);
  const result = phoneNumbers.map((phone) => ({
    number: phone,
    platform: { whatsapp: false },
  }));

  return result;
}

function phonesArray(
  primary_number: ContactNumber,
  secondary_number?: ContactNumber | null,
  tertiary_number?: ContactNumber | null
) {
  let phones = [];
  phones.push(primary_number);

  if (secondary_number) {
    phones.push(secondary_number);
  }

  if (tertiary_number) {
    phones.push(tertiary_number);
  }
  return phones;
}

export default function EditContactModal() {
  const contact = contactStore.getState().contact;
  const setContactTags = contactStore.getState().setContactTags;

  const { id } = useLocalSearchParams();

  const { data: savedContact } = useQuery({
    queryKey: ["saved-contact", id],
    queryFn: async () => {
      const result = await getContactDetailsById(id.toString());
      if (!result) {
        return { fullname: "", thumbnail: "", phones: [], remarks: "", tags: [] };
      }
      setContactTags(result.tags);
      return {
        fullname: result.fullname,
        thumbnail: result.thumbnail,
        phones: phonesArray(
          result.primary_number,
          result?.secondary_number,
          result?.tertiary_number
        ),
        remarks: result.remarks,
        tags: result.tags,
      };
    },
    enabled: Boolean(id),
  });

  const { data: loadedContact } = useQuery({
    queryKey: ["contact"],
    queryFn: async () => ({
      fullname: (await contact?.getFullName()) ?? "",
      thumbnail: (await contact?.getThumbnail()) ?? (await contact?.getImage()) ?? "",
      phones: await contact?.getPhones(),
    }),
    enabled: Boolean(!id),
  });

  return (
    <>
      {/*Updation of existing or already added contact*/}
      {id ? (
        <EditContactForm
          id={id.toString()}
          remarks={savedContact?.remarks ?? ""}
          fullname={savedContact?.fullname ?? ""}
          thumbnail={savedContact?.thumbnail ?? ""}
          phoneNumbers={savedContact?.phones ?? []}
        />
      ) : (
        // To be added manually or using contact picker for the first time
        <EditContactForm
          fullname={loadedContact?.fullname ?? ""}
          thumbnail={loadedContact?.thumbnail ?? ""}
          phoneNumbers={phones(loadedContact?.phones)}
        />
      )}
    </>
  );
}
