import contactStore from "@/store/contact-store";
import {
  Avatar,
  Button,
  ControlField,
  Description,
  Input,
  Label,
  Skeleton,
  Spinner,
  TextField,
  useAvatar,
  useToast,
} from "heroui-native";
import { View, ScrollView } from "react-native";
import { regex } from "arkregex";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { ExistingPhone } from "expo-contacts";
import { Stack } from "expo-router";
import PhoneInput from "@/components/phone-input";
import ContactCaptureModal from "./contact-capture-modal";
import { useStore } from "zustand";
import { FontAwesome6 } from "@expo/vector-icons";
import { deleteImage, imagePicker } from "@/shared/image-utils";
import { useEffect, useState } from "react";
import { addContact } from "@/database/query";

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
    platform: { whatsapp: false },
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
  const [showCameraModal, setShowCameraModal] = useState(false);
  const resizedImageUri = useStore(contactStore, (state) => state.resizedImageUri);
  const setResizedImageUri = useStore(contactStore, (state) => state.setResizedImageUri);

  const { toast } = useToast();

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
      console.log(JSON.stringify(value));
      if (value.phones.length) {
        const primary = value.phones[0];
        const secondary = value.phones[1] || null;
        const tertiary = value.phones[2] || null;
        await addContact(value.fullname, value.thumbnail, primary, secondary, tertiary);
      } else {
        toast.show("No contact number entered");
      }
    },
  });

  useEffect(() => {
    if (resizedImageUri) {
      form.setFieldValue("thumbnail", resizedImageUri);
    }
  }, [resizedImageUri]);

  function resetContactImage() {
    if (resizedImageUri) {
      try {
        // delete image which is captured or saved
        if (resizedImageUri.includes("in.lite.loocal")) {
          deleteImage(resizedImageUri);
        }
        setResizedImageUri(null);
        form.setFieldValue("thumbnail", "");
        toast.show("Removed from cache successfully.");
      } catch (err) {
        console.log(err);
        toast.show("No such file exists.");
      }
    }
    return;
  }

  async function pickFromGallery() {
    const imageUri = await imagePicker();
    if (imageUri) {
      setResizedImageUri(imageUri);
    }
  }

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
          <View className="flex flex-1 items-center gap-8 p-4">
            <View className="flex items-center gap-4">
              <form.Field
                name="thumbnail"
                children={({ state }) => (
                  <Avatar className="size-32" alt={contactDetails?.fullname}>
                    <Avatar.Image
                      className="rounded-full"
                      source={{
                        uri: state.value ?? undefined,
                      }}
                    />
                    <AvatarContent />
                    <Avatar.Fallback delayMs={300}>
                      <FontAwesome6 name="user-circle" size={128} color="black" />
                    </Avatar.Fallback>
                  </Avatar>
                )}
              />

              <View className="flex flex-row gap-3 items-center">
                <Button
                  aria-label="Take picture using Camera"
                  onPress={() => setShowCameraModal(true)}
                  variant="outline"
                >
                  <FontAwesome6 name="camera" size={20} color="black" />
                </Button>

                <Button
                  aria-label="Pick picture from gallery"
                  variant="outline"
                  onPress={pickFromGallery}
                >
                  <FontAwesome6 name="image" size={20} color="black" />
                </Button>

                <form.Subscribe
                  selector={(state) => state.values.thumbnail}
                  children={(thumbnail) =>
                    thumbnail ? (
                      <Button
                        aria-label="Reset profile picture"
                        variant="outline"
                        onPress={resetContactImage}
                      >
                        <FontAwesome6 name="trash" size={20} color="black" />
                      </Button>
                    ) : null
                  }
                />
              </View>
            </View>
            <View className="w-full gap-4" id="edit-contact-form">
              <form.Field
                name="fullname"
                children={({ state, handleChange }) => (
                  <TextField isRequired>
                    <Label>Full name</Label>
                    <Input
                      className="text-base"
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
                          <View key={idx}>
                            <form.Field key={idx} name={`phones[${idx}].number`}>
                              {(subField) => {
                                return (
                                  <TextField isRequired={idx + 1 === 1}>
                                    <Label>{phoneMaps.get(`${idx + 1}`)}</Label>
                                    <PhoneInput
                                      className="text-base"
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
                            <form.Field mode="array" name={`phones[${idx}].platform.whatsapp`}>
                              {(subField) => {
                                return (
                                  <ControlField
                                    className="mt-2"
                                    isSelected={subField.state.value}
                                    onSelectedChange={subField.handleChange}
                                  >
                                    <View className="flex flex-row gap-2">
                                      <ControlField.Indicator variant="checkbox" />
                                      <View className="flex-1 gap-2">
                                        <View className="flex flex-row gap-2 items-center ">
                                          <FontAwesome6 name="whatsapp" size={20} color="green" />
                                          <Label>Whatsapp</Label>
                                        </View>
                                        <Description>
                                          Whatsapp associated with this number
                                        </Description>
                                      </View>
                                    </View>
                                  </ControlField>

                                  // <Label>Whatsapp</Label>
                                  //   <Checkbox
                                  //     animation="disable-all"
                                  //     isSelected={subField.state.value}
                                  //     onSelectedChange={subField.handleChange}
                                  //   >
                                  //     <Checkbox.Indicator />
                                  //   </Checkbox>
                                );
                              }}
                            </form.Field>
                          </View>
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
          <View className="flex flex-1 items-center justify-center p-3">
            <Spinner size="lg" color="default">
              <Spinner.Indicator animation={{ rotation: { speed: 1 } }} />
            </Spinner>
          </View>
        )}
      </ScrollView>

      <ContactCaptureModal
        setShowCameraModal={setShowCameraModal}
        showCameraModal={showCameraModal}
      />
    </>
  );
}
