import { ContactAvatar } from "@/components/contact-avatar";
import PhoneInput from "@/components/phone-input";
import FontAwesome6 from "@react-native-vector-icons/fontawesome6";
import { Button } from "heroui-native/button";
import { ControlField } from "heroui-native/control-field";
import { Description } from "heroui-native/description";
import { Input } from "heroui-native/input";
import { Label } from "heroui-native/label";
import { TextField } from "heroui-native/text-field";
import { ScrollView, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import ContactCaptureModal from "./contact-capture-modal";
import { deleteImage, imagePicker } from "@/shared/image-utils";
import { useStore } from "zustand/react";
import contactStore from "@/store/contact-store";
import { useForm } from "@tanstack/react-form";
import { useToast } from "heroui-native/toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { addContact, updateContact } from "@/database/query";
import { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { Select } from "heroui-native/select";
import { ContactNumber, TagsType } from "@/database/types";
import { getAllTags } from "@/database/query/tags";
import { Chip } from "heroui-native/chip";
import { Typography } from "heroui-native/text";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { Dialog } from "heroui-native/dialog";

const phoneMaps = new Map([
  ["1", "Primary number"],
  ["2", "Secondary number"],
  ["3", "Tertiary number"],
]);

interface EditContactFormProps {
  id?: string;
  fullname: string;
  thumbnail: string;
  phoneNumbers: ContactNumber[];
  remarks?: string;
}

export default function EditContactForm({
  id,
  fullname,
  thumbnail,
  phoneNumbers,
  remarks,
}: EditContactFormProps) {
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [tagModalOpen, setTagModalOpen] = useState(false);

  const setResizedImageUri = useStore(contactStore, (state) => state.setResizedImageUri);
  const resizedImageUri = useStore(contactStore, (state) => state.resizedImageUri);

  const contactTags = useStore(contactStore, (state) => state.contactTags);
  const setContactTags = useStore(contactStore, (state) => state.setContactTags);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: tagList } = useQuery({
    queryKey: ["tag-list"],
    queryFn: async () => {
      const result = await getAllTags();
      return result;
    },
  });

  async function pickFromGallery() {
    const imageUri = await imagePicker();
    if (imageUri) {
      setResizedImageUri(imageUri);
    }
  }

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

  const form = useForm({
    defaultValues: {
      fullname: fullname,
      thumbnail: thumbnail,
      phones: phoneNumbers,
      remarks: remarks,
    },
    onSubmit: async ({ value }) => {
      console.log(JSON.stringify(value));
      if (value.phones.length) {
        const primary = value.phones[0];
        const secondary = value.phones[1] || null;
        const tertiary = value.phones[2] || null;

        // Update existing contact
        if (id) {
          await updateContact(
            id,
            value.fullname,
            value.thumbnail,
            value.remarks || null,
            primary,
            secondary,
            tertiary,
            contactTags
          );
          toast.show("Contact updated successfully.");
        } else {
          await addContact(
            value.fullname,
            value.thumbnail,
            value.remarks || null,
            primary,
            secondary,
            tertiary,
            contactTags
          );
          toast.show("Contact added successfully.");
        }
        queryClient.invalidateQueries({ queryKey: ["contact-list"] });
        router.replace("/(tabs)");
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

  console.log("Form data", form.getFieldValue("phones"), phoneNumbers);

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
        <View className="flex flex-1 items-center gap-8 p-4">
          <View className="flex items-center gap-4">
            <form.Field
              name="thumbnail"
              children={({ state }) => (
                <ContactAvatar
                  className="size-32"
                  name={fullname}
                  thumbnail={state.value ?? undefined}
                  iconSize={128}
                />
              )}
            />

            <View className="flex flex-row gap-3 items-center">
              <Button
                aria-label="Take picture using Camera"
                onPress={() => setShowCameraModal(true)}
                variant="outline"
              >
                <FontAwesome6 iconStyle="solid" name="camera" size={20} color="black" />
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
                      <FontAwesome6 iconStyle="solid" name="trash" size={20} color="black" />
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
                  <Label>
                    <Label.Text>
                      <Typography type="h5">Full name</Typography>
                    </Label.Text>
                  </Label>
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
                  <KeyboardAwareScrollView bottomOffset={50}>
                    <View className="gap-4">
                      {state.value.map((_, idx) => {
                        return (
                          <View key={idx}>
                            <form.Field key={idx} name={`phones[${idx}].number`}>
                              {(subField) => {
                                console.log("state", state);
                                return (
                                  <TextField isRequired={idx + 1 === 1}>
                                    <Label>
                                      <Label.Text>
                                        <Typography type="h5">
                                          {phoneMaps.get(`${idx + 1}`)}
                                        </Typography>
                                      </Label.Text>
                                    </Label>
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
                                          <FontAwesome6
                                            iconStyle="brand"
                                            name="whatsapp"
                                            size={20}
                                            color="green"
                                          />
                                          <Label>Whatsapp</Label>
                                        </View>
                                        <Description>
                                          Whatsapp associated with this number
                                        </Description>
                                      </View>
                                    </View>
                                  </ControlField>
                                );
                              }}
                            </form.Field>
                          </View>
                        );
                      })}
                      <Button
                        isDisabled={state.value.length === 3}
                        onPress={() => pushValue({ number: "", platform: { whatsapp: false } })}
                      >
                        Add phone
                      </Button>
                      <form.Field
                        name="remarks"
                        children={({ state, handleChange }) => (
                          <TextField>
                            <Label>
                              <Label.Text>
                                <Typography type="h5">Remarks</Typography>
                              </Label.Text>
                            </Label>
                            <Input
                              multiline
                              numberOfLines={2}
                              className="text-base"
                              value={state.value}
                              onChangeText={handleChange}
                              placeholder="Add note"
                            />
                          </TextField>
                        )}
                      />
                    </View>
                  </KeyboardAwareScrollView>
                );
              }}
            />

            <Label>
              <Label.Text>
                <Typography type="h5">Tags</Typography>
              </Label.Text>
            </Label>
            <View className="flex flex-row gap-2 flex-wrap">
              {contactTags.map((tag) => (
                <Chip className="border border-primary" variant="soft" key={tag.id}>
                  <Chip.Label className="text-base">{tag.name}</Chip.Label>
                  <Button
                    onPress={() => {
                      setContactTags(contactTags.filter((prevTag) => prevTag.id !== tag.id));
                    }}
                    variant="ghost"
                    className="h-full px-1"
                  >
                    <MaterialDesignIcons name="close" size={18} />
                  </Button>
                </Chip>
              ))}
              <Chip className="border border-primary" variant="tertiary">
                <Button
                  className="h-full px-1"
                  variant="ghost"
                  onPress={() => setTagModalOpen(true)}
                >
                  <MaterialIcons name="add" size={18} />
                  <Chip.Label className="text-base">Add</Chip.Label>
                </Button>
              </Chip>
              <Dialog isOpen={tagModalOpen} onOpenChange={setTagModalOpen}>
                <Dialog.Portal>
                  <Dialog.Overlay />
                  <Dialog.Content className="bg-background p-4">
                    <Dialog.Title className="mb-3">Select tags</Dialog.Title>
                    <View className="flex flex-row gap-2 flex-wrap">
                      {tagList?.map((tag) => (
                        <Chip
                          disabled={contactTags.includes(tag)}
                          onPress={() => setContactTags([...contactTags, tag])}
                          className="border border-primary"
                          variant={contactTags.includes(tag) ? "secondary" : "soft"}
                          key={tag.id}
                        >
                          <Chip.Label className="text-base">{tag.name}</Chip.Label>
                        </Chip>
                      ))}
                    </View>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog>
            </View>
          </View>
        </View>
      </ScrollView>

      <ContactCaptureModal
        setShowCameraModal={setShowCameraModal}
        showCameraModal={showCameraModal}
      />
    </>
  );
}
