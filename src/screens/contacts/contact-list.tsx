import { View, Text, ScrollView } from "react-native";
import { SearchFilterContact } from "./search-contact";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllContacts } from "@/database/query";
import { Separator } from "heroui-native";

export function ContactList() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: contactList, isLoading } = useQuery({
    queryKey: ["contact-list"],
    queryFn: async () => {
      const contacts = await getAllContacts();
      return contacts;
    },
  });

  return (
    <>
      <SearchFilterContact searchValue={searchQuery} setSearchValue={setSearchQuery} />
      <Separator className="mt-4" />
      <ScrollView className="flex-1 gap-2">
        {contactList?.map((contact) => (
          <View key={contact.id} className="border-border h-auto w-full border p-2">
            <Text>{contact.fullname}</Text>
          </View>
        ))}
      </ScrollView>
    </>
  );
}
