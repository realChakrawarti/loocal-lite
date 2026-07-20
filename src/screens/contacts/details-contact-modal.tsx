import { ContactAvatar } from "@/components/contact-avatar";
import { ContactNumber, getContactDetailsById } from "@/database/query";
import { FontAwesome6, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Button, Surface, Typography } from "heroui-native";
import { View, ScrollView, Text } from "react-native";
import * as Linking from "expo-linking";

function RightHeader(id: string | undefined) {
  const router = useRouter();
  if (!id) return null;

  return (
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
      <Button variant="ghost">
        <MaterialIcons name="share" size={20} color="black" />
      </Button>
      <Button variant="ghost">
        <MaterialIcons name="delete" size={20} color="black" />
      </Button>
    </View>
  );
}

const phoneMaps = new Map([
  ["1", { label: "Primary number", icon: "numeric-1-circle-outline" }],
  ["2", { label: "Secondary number", icon: "numeric-2-circle-outline" }],
  ["3", { label: "Tertiary number", icon: "numeric-3-circle-outline" }],
]);

function PhoneCard({ contact, idx }: { contact?: ContactNumber | null; idx: number }) {
  if (!contact) return null;

  return (
    <Surface
      variant="tertiary"
      className="p-1 rounded-md bg-orange-400/10 flex flex-1 flex-row justify-between items-center"
    >
      <View className="flex gap-2 flex-row items-end">
        <MaterialCommunityIcons
          name={phoneMaps.get(idx.toString())?.icon}
          size={24}
          color="black"
        />
        <Typography type="h5">{contact.number}</Typography>
      </View>
      <View className="flex flex-1 flex-row gap-2 items-center justify-end">
        {contact.platform.whatsapp ? (
          <Button
            variant="ghost"
            onPress={() => Linking.openURL(`whatsapp://send?phone=${contact.number}`)}
          >
            <FontAwesome6 name="whatsapp" size={24} color="green" />
          </Button>
        ) : null}
        <Button variant="ghost" onPress={() => Linking.openURL(`tel:${contact.number}`)}>
          <FontAwesome6 name="phone" size={16} color="black" />
        </Button>
      </View>
    </Surface>
  );
}

export default function DetailsContactModal() {
  const { id } = useLocalSearchParams();

  const { data: contactDetails, isLoading } = useQuery({
    queryKey: [`contact-details-${id}`],
    queryFn: async () => {
      const contactDetails = await getContactDetailsById(id.toString());
      return contactDetails;
    },
  });

  console.log("Details", contactDetails);

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
          headerRight: () => RightHeader(contactDetails?.id),
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
              return <PhoneCard idx={idx + 1} key={phone?.number} contact={phone} />;
            })}
            {/*<PhoneCard contact={contactDetails?.secondary_number} />
            <PhoneCard contact={contactDetails?.tertiary_number} />*/}
          </View>
          {contactDetails?.remarks ? (
            <View className="flex flex-1 gap-1">
              <Typography className="underline underline-offset-2" type="h5">
                Remarks
              </Typography>
              <Typography type="body">{contactDetails?.remarks}</Typography>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </>
  );
}
