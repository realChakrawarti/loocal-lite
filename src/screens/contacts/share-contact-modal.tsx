import { ContactNumber, ContactsType, TagsType } from "@/database/types";
import { createVCard, parseVCard, shareVCard } from "@/shared/vcard";
import { Button } from "heroui-native/button";
import { Popover } from "heroui-native/popover";
import { Typography } from "heroui-native/text";
import { View, Text, ScrollView } from "react-native";
import QRCode from "react-qr-code";

type ShareContactModalProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  contact: ContactsType & { tags: TagsType[] };
};

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

export default function ShareContactModal({ open, setOpen, contact }: ShareContactModalProps) {
  const vCard = createVCard({
    fullname: contact.fullname,
    thumbnail: contact.thumbnail,
    phones: phonesArray(contact.primary_number, contact.secondary_number, contact.tertiary_number),
    remarks: contact.remarks,
    tags: contact.tags,
  });

  console.log(">> : vCard", vCard);

  return (
    <Popover isOpen={open} onOpenChange={setOpen} presentation="bottom-sheet">
      <Popover.Portal>
        <Popover.Overlay />
        <Popover.Content contentContainerClassName="p-0" presentation="bottom-sheet">
          <View className="p-2 flex flex-1 items-center gap-4">
            <Typography className="font-semibold text-center" type="h3">
              {contact.fullname}
            </Typography>
            <QRCode value={vCard} size={192} />
            <Button onPress={() => shareVCard(vCard, contact.fullname)}>Share contact</Button>
          </View>
        </Popover.Content>
      </Popover.Portal>
    </Popover>
  );
}
