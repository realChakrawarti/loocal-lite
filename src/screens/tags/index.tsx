import { Separator } from "heroui-native/separator";
import { ScrollView, View } from "react-native";
import SearchTags from "./search-tags";
import { Chip } from "heroui-native/chip";
import { useState } from "react";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import AddEditForm from "./add-edit-form";
import { Button } from "heroui-native/button";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { addTag, deleteTagById, getAllTags } from "@/database/query/tags";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";

export default function TagScreen() {
  const [isOpen, setIsOpen] = useState(false);

  const { data: tags, refetch } = useQuery({
    queryKey: ["tag-list"],
    queryFn: async () => {
      const result = await getAllTags();
      return result;
    },
  });

  const [selectedTag, setSelectedTag] = useState("");

  function handleOnChange(value: string) {
    setSelectedTag(value);
  }

  async function handleOnSubmit() {
    await addTag(selectedTag);
    refetch();
    setSelectedTag("");
    setIsOpen(false);
  }

  async function deleteTag(tagId: string) {
    await deleteTagById(tagId);
    refetch();
  }

  return (
    <>
      <SearchTags searchValue="" setSearchValue={() => {}} />
      <Separator className="mt-4" />
      <ScrollView className="bg-background p-4">
        <View className="flex flex-row gap-2 flex-wrap">
          {tags?.map((tag) => (
            <Chip className="border border-primary" variant="soft" key={tag.id}>
              <Button
                onPress={() => {
                  setIsOpen(true);
                  setSelectedTag(tag.name);
                }}
                variant="ghost"
                className="p-0 h-auto"
              >
                <Chip.Label className="text-base">{tag.name}</Chip.Label>
                <Button onPress={() => deleteTag(tag.id)} variant="ghost" className="h-full px-1">
                  <MaterialDesignIcons name="close" size={18} />
                </Button>
              </Button>
            </Chip>
          ))}
        </View>
      </ScrollView>
      <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={150}>
        <View className="absolute right-4 bottom-4">
          <Button
            onPress={() => setIsOpen(true)}
            className="flex size-13 items-center justify-center rounded-full"
          >
            <MaterialIcons name="add" size={20} color={"#fff"} />
          </Button>
        </View>
      </KeyboardAvoidingView>
      <AddEditForm
        value={selectedTag}
        changeValue={handleOnChange}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onSubmit={handleOnSubmit}
      />
    </>
  );
}
