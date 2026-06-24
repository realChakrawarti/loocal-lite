import contactStore from "@/store/contact-store";
import {
  Avatar,
  Button,
  Input,
  Label,
  Skeleton,
  Spinner,
  TextField,
  useAvatar,
} from "heroui-native";
import { View, ScrollView } from "react-native";
import { regex } from "arkregex";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { ExistingPhone } from "expo-contacts";
import { Stack } from "expo-router";
import PhoneInput from "@/widgets/phone-input";
import ContactCaptureModal from "./contact-capture-modal";
import { useStore } from "zustand";
import { FontAwesome6 } from "@expo/vector-icons";

function normalizePhoneNumber(phone: string) {
  const phoneRegex = regex("^(?:\\+91|0)?([6-9]\\d{9})$");
  const removedWhiteSpace = phone.replaceAll(" ", "");

  if (phoneRegex.test(removedWhiteSpace)) {
    const nationalNumber = removedWhiteSpace.match(phoneRegex);
    return nationalNumber?.at(1);
  }
  return removedWhiteSpace;
}

const phoneMaps = new Map([
  ["1", "Primary number"],
  ["2", "Secondary number"],
  ["3", "Tertiary number"],
]);

function uniquePhoneNumbers(phones: ExistingPhone[]) {
  const numbers: string[] = [];

  if (!phones.length) {
    console.log("Empty phones");
    return numbers;
  }

  phones.forEach((phone) => {
    const normalizedPhone = normalizePhoneNumber(phone.number || "");
    if (normalizedPhone && !numbers.includes(normalizedPhone)) {
      console.log("Found ", normalizedPhone, ", pushed,");
      return numbers.push(normalizedPhone);
    }
  });

  return numbers;
}

function phones(phones: ExistingPhone[] | undefined) {
  if (!phones) return [];

  const phoneNumbers = uniquePhoneNumbers(phones);
  return phoneNumbers.map((phone) => ({
    number: phone,
    platform: [],
  }));
}

function AvatarContent() {
  const { status } = useAvatar();
  if (status === "loading") {
    return <Skeleton className="absolute inset-0 rounded-full" />;
  }
  return null;
}

export default function EditContactModal() {
  const contact = contactStore.getState().contact;
  const capturedImageUri = useStore(contactStore, (state) => state.capturedImageUri);

  const { data: contactDetails, isLoading } = useQuery({
    queryKey: ["contact"],
    queryFn: async () => ({
      fullname: await contact?.getFullName(),
      thumbnail: (await contact?.getThumbnail()) ?? (await contact?.getImage()) ?? "",
      phones: await contact?.getPhones(),
    }),
  });

  const form = useForm({
    defaultValues: {
      fullname: contactDetails?.fullname ?? "",
      thumbnail: contactDetails?.thumbnail ?? "",
      phones: phones(contactDetails?.phones),
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log(value);
    },
  });

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => {
            return <Button onPress={() => form.handleSubmit()}>Save</Button>;
          },
        }}
      />
      <ScrollView>
        {!isLoading ? (
          <View className="p-3 flex-1 flex items-center gap-8">
            <View className="flex items-center gap-4">
              <Avatar className="size-32" alt={contactDetails?.fullname}>
                <Avatar.Image
                  className="rounded-2xl"
                  source={{
                    uri: contactDetails?.thumbnail || capturedImageUri || undefined,
                  }}
                />
                <AvatarContent />
                <Avatar.Fallback delayMs={300}>
                  <FontAwesome6 name="user-circle" size={128} color="black" />
                </Avatar.Fallback>
              </Avatar>
              <ContactCaptureModal />
            </View>
            <View className="w-full gap-4" id="edit-contact-form">
              <form.Field
                name="fullname"
                children={({ state, handleChange }) => (
                  <TextField isRequired>
                    <Label>Full name</Label>
                    <Input
                      value={state.value}
                      onChangeText={handleChange}
                      placeholder="Full name"
                    />
                  </TextField>
                )}
              />
              <form.Field
                name="phones"
                mode="array"
                children={({ state, pushValue, removeValue }) => {
                  return (
                    <>
                      {state.value.map((_, idx) => {
                        return (
                          <form.Field key={idx} name={`phones[${idx}].number`}>
                            {(subField) => {
                              return (
                                <TextField isRequired={idx + 1 === 1}>
                                  <Label>{phoneMaps.get(`${idx + 1}`)}</Label>
                                  <PhoneInput
                                    trigger={() => removeValue(idx)}
                                    keyboardType="phone-pad"
                                    value={subField.state.value}
                                    onChangeText={subField.handleChange}
                                    placeholder={phoneMaps.get(`${idx + 1}`)}
                                  />
                                </TextField>
                              );
                            }}
                          </form.Field>
                        );
                      })}
                      <Button
                        isDisabled={state.value.length === 3}
                        onPress={() => pushValue({ number: "", platform: [] })}
                      >
                        Add phone
                      </Button>
                    </>
                  );
                }}
              />
            </View>
          </View>
        ) : (
          <View className="p-3 flex-1 flex items-center justify-center">
            <Spinner size="lg" color="default">
              <Spinner.Indicator animation={{ rotation: { speed: 1 } }} />
            </Spinner>
          </View>
        )}
      </ScrollView>
    </>
  );
}
