import { ScrollView } from "react-native";
import { SearchFilterContact } from "./search-contact";
import { Fragment, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { filterContactByTags, getAllContacts } from "@/database/query";
import { ListGroup, Separator, Typography } from "heroui-native";
import { useRouter } from "expo-router";
import { ContactAvatar } from "@/components/contact-avatar";
import { useStore } from "zustand";
import contactStore from "@/store/contact-store";
import { ContactsType } from "@/database/types";

export function ContactList() {
  const filteredTags = useStore(contactStore, (state) => state.filterTags);

  const [searchQuery, setSearchQuery] = useState("");

  const { data: filteredList, refetch } = useQuery({
    queryKey: ["filter-contact", filteredTags.join(", ")],
    queryFn: async () => {
      const filteredContacts = await filterContactByTags(filteredTags);
      return filteredContacts;
    },
    enabled: Boolean(filteredTags.length),
    initialData: [],
  });

  const { data: contactList } = useQuery({
    queryKey: ["contact-list"],
    queryFn: async () => {
      const contacts = await getAllContacts();
      return contacts;
    },
    enabled: Boolean(!filteredTags.length),
  });

  return (
    <>
      <SearchFilterContact
        searchValue={searchQuery}
        setSearchValue={setSearchQuery}
        refetchContact={refetch}
      />
      <Separator className="mt-4" />
      <ScrollView className="flex-1 gap-2 px-4 pt-4">
        <ListGroup>
          {filteredTags.length
            ? filteredList?.map((contact) => <ContactListings key={contact.id} contact={contact} />)
            : contactList?.map((contact) => <ContactListings key={contact.id} contact={contact} />)}
        </ListGroup>
      </ScrollView>
    </>
  );
}

function ContactListings({ contact }: { contact: ContactsType }) {
  const router = useRouter();
  return (
    <Fragment>
      <ListGroup.Item
        onPress={() =>
          router.push({
            pathname: "/details-contact",
            params: { id: contact.id },
          })
        }
      >
        <ListGroup.ItemPrefix>
          <ContactAvatar
            thumbnail={contact.thumbnail}
            name={contact.fullname}
            className="size-8"
            iconSize={32}
          />
        </ListGroup.ItemPrefix>
        <ListGroup.ItemContent>
          <ListGroup.ItemTitle>
            <Typography type="h6">{contact.fullname}</Typography>
          </ListGroup.ItemTitle>
          {/*<ListGroup.ItemDescription>...</ListGroup.ItemDescription>*/}
        </ListGroup.ItemContent>
        {/*<ListGroup.ItemSuffix />*/}
      </ListGroup.Item>
      <Separator />
    </Fragment>
  );
}
