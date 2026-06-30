import { Column, Host, RNHostView, ScrollView } from "@expo/ui";
import { View, Text } from "react-native";
import { SearchContact } from "./search-contact";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllContacts } from "@/database/query";

export function ContactList() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["contact-list"],
    queryFn: async () => {
      const contacts = await getAllContacts();
      return contacts;
    },
  });

  console.log("Contact list data", data);

  return (
    <Host style={{ flex: 1 }}>
      <Column spacing={8}>
        <RNHostView matchContents>
          <View className="px-3 py-2">
            <SearchContact searchValue={searchQuery} setSearchValue={setSearchQuery} />
          </View>
        </RNHostView>
        <ScrollView>
          <Column spacing={8}>
            {Array.from({ length: 100 }).map((_, i) => (
              <RNHostView matchContents key={i}>
                <View className="border-border h-auto w-full border p-2">
                  <Text>Row {i + 1}</Text>
                </View>
              </RNHostView>
            ))}
          </Column>
        </ScrollView>
      </Column>
    </Host>
  );
}
