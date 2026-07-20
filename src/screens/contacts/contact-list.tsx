import { ScrollView } from "react-native";
import { SearchFilterContact } from "./search-contact";
import { Fragment, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllContacts } from "@/database/query";
import { ListGroup, Separator, Typography } from "heroui-native";
import { useRouter } from "expo-router";
import { ContactAvatar } from "@/components/contact-avatar";

export function ContactList() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: contactList } = useQuery({
    queryKey: ["contact-list"],
    queryFn: async () => {
      const contacts = await getAllContacts();
      return contacts;
    },
  });

  const router = useRouter();

  return (
    <>
      <SearchFilterContact searchValue={searchQuery} setSearchValue={setSearchQuery} />
      <Separator className="mt-4" />
      <ScrollView className="flex-1 gap-2 px-4 pt-4">
        <ListGroup>
          {contactList?.map((contact) => (
            <Fragment key={contact.id}>
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
            // <Link
            //   href={{ pathname: "/details-contact", params: { id: contact.id } }}
            // >
            //   <View className="border-border h-auto w-full border p-2">
            //
            //   </View>
            // </Link>
          ))}
        </ListGroup>
      </ScrollView>
    </>
  );
}
