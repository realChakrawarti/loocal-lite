import { ContactAvatar } from "@/components/contact-avatar";
import { getContactDetailsById } from "@/database/query";
import FontAwesome6 from "@react-native-vector-icons/fontawesome6";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Button, Chip, Surface, Typography } from "heroui-native";
import { View, ScrollView } from "react-native";
import * as Linking from "expo-linking";
import { ContactNumber, ContactsType, TagsType } from "@/database/types";
import ShareContactModal from "./share-contact-modal";
import { useState } from "react";

function RightHeader({
  id,
  contact,
}: {
  id: string | undefined;
  contact: ContactsType & { tags: TagsType[] };
}) {
  const router = useRouter();
  const [shareOpen, setShareOpen] = useState(false);

  if (!id || !contact) return null;

  return (
    <>
      <View className="flex items-end flex-row gap-0.5">
        <Button
          onPress={() =>
            router.replace({
              pathname: "/edit-contact",
              params: { id: id },
            })
          }
          variant="ghost"
        >
          <MaterialIcons name="edit" size={20} color="black" />
        </Button>
        <Button onPress={() => setShareOpen(true)} variant="ghost">
          <MaterialIcons name="share" size={20} color="black" />
        </Button>
        <Button variant="ghost">
          <MaterialIcons name="delete" size={20} color="black" />
        </Button>
      </View>
      <ShareContactModal open={shareOpen} setOpen={setShareOpen} contact={contact} />
    </>
  );
}

const phoneMaps = new Map([
  ["1", "Primary number"],
  ["2", "Secondary number"],
  ["3", "Tertiary number"],
]);

function PhoneCard({ contact, idx }: { contact?: ContactNumber | null; idx: number }) {
  if (!contact) return null;

  return (
    <View className="flex flex-1 gap-2">
      <View className="flex gap-2 flex-row">
        <Typography type="h5">{phoneMaps.get(idx.toString())}</Typography>
      </View>
      <Surface
        variant="tertiary"
        className="py-1 rounded-md flex flex-1 flex-row justify-between items-center px-2"
      >
        <View className="flex gap-2 flex-row items-end">
          <Typography className="font-semibold" type="body">
            {contact.number}
          </Typography>
        </View>
        <View className="flex flex-1 flex-row gap-2 items-center justify-end">
          {contact.platform.whatsapp ? (
            <Button
              variant="ghost"
              onPress={() => Linking.openURL(`whatsapp://send?phone=${contact.number}`)}
            >
              <FontAwesome6 iconStyle="brand" name="whatsapp" size={24} color="green" />
            </Button>
          ) : null}
          <Button variant="ghost" onPress={() => Linking.openURL(`tel:${contact.number}`)}>
            <FontAwesome6 iconStyle="solid" name="phone" size={16} color="black" />
          </Button>
        </View>
      </Surface>
    </View>
  );
}

export default function DetailsContactModal() {
  const { id } = useLocalSearchParams();

  const { data: contactDetails } = useQuery({
    queryKey: [`contact-details-${id}`],
    queryFn: async () => {
      const contactDetails = await getContactDetailsById(id.toString());
      return contactDetails;
    },
  });

  const phones = [
    contactDetails?.primary_number,
    contactDetails?.secondary_number,
    contactDetails?.tertiary_number,
  ];

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "",
          headerRight: () => (
            <RightHeader
              id={id.toString()}
              contact={contactDetails as unknown as ContactsType & { tags: TagsType[] }}
            />
          ),
          // RightHeader(
          //   id.toString(),
          //   contactDetails as unknown as ContactsType & { tags: TagsType[] }
          // ),
        }}
      />

      <ScrollView>
        <View className="flex flex-1 gap-8 p-4">
          <View className="flex flex-1 items-center gap-8">
            <ContactAvatar
              iconSize={128}
              className="size-32"
              name={contactDetails?.fullname ?? ""}
              thumbnail={contactDetails?.thumbnail}
            />
            <Typography type="h3">{contactDetails?.fullname}</Typography>
          </View>
          <View className="flex flex-1 gap-2">
            {phones.map((phone, idx) => {
              return <PhoneCard idx={idx + 1} key={idx + 1} contact={phone} />;
            })}
          </View>
          {contactDetails?.remarks ? (
            <View className="flex flex-1 gap-1">
              <Typography type="h5">Remarks</Typography>
              <Surface variant="tertiary" className="p-2 rounded-md">
                <Typography className="font-semibold" type="body">
                  {contactDetails?.remarks}
                </Typography>
              </Surface>
            </View>
          ) : null}
          {contactDetails?.tags.length ? (
            <View className="flex flex-1 gap-1">
              <Typography type="h5">Tags</Typography>
              <View className="flex flex-row flex-wrap gap-2">
                {contactDetails?.tags.map((tag) => (
                  <Chip className="border border-primary" variant="tertiary" key={tag.id}>
                    <Chip.Label className="text-base">{tag.name}</Chip.Label>
                  </Chip>
                ))}
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </>
  );
}
