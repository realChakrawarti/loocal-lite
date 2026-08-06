import { getAllTags } from "@/database/query/tags";
import { TagsType } from "@/database/types";
import contactStore from "@/store/contact-store";
import { useQuery } from "@tanstack/react-query";
import { Chip } from "heroui-native/chip";
import { SearchField } from "heroui-native/search-field";
import { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { useStore } from "zustand";

type SearchContactProps = {
  searchValue: string;
  setSearchValue: (query: string) => void;
  refetchContact: () => void;
};

export function SearchFilterContact({
  searchValue,
  setSearchValue,
  refetchContact,
}: SearchContactProps) {
  const filterTags = useStore(contactStore, (state) => state.filterTags);
  const setFilterTags = useStore(contactStore, (state) => state.setFilterTags);

  function handleTagChange(tagId: string) {
    setFilterTags(tagId);
    if (filterTags.length) {
      refetchContact();
    }
  }

  const { data: tagList, isLoading } = useQuery({
    queryKey: ["tag-list"],
    queryFn: async () => {
      const result = await getAllTags();
      return result;
    },
  });

  return (
    <View className="gap-4">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="pl-4 pt-4">
          <View className="flex flex-row gap-2 pr-4">
            {tagList?.map((tag) => (
              <Chip
                variant={filterTags.includes(tag.id) ? "soft" : "tertiary"}
                className="border border-primary"
                key={tag.id}
                onPress={() => handleTagChange(tag.id)}
              >
                <Chip.Label>
                  <Text>{tag.name}</Text>
                </Chip.Label>
              </Chip>
            ))}
          </View>
        </View>
      </ScrollView>
      <SearchField className="px-4" value={searchValue} onChange={setSearchValue}>
        <SearchField.Group>
          <SearchField.SearchIcon />
          <SearchField.Input className="text-base" placeholder="Search by name or profession" />
          <SearchField.ClearButton />
        </SearchField.Group>
      </SearchField>
    </View>
  );
}
