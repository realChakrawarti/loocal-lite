import { View } from "react-native";
import { AddContactPopover } from "./add-contact-popover";
import { ContactList } from "./contact-list";

export default function ContactScreen() {
  return (
    <View className="relative flex-1 p-4">
      <ContactList />
      <View className="absolute right-4 bottom-4">
        <AddContactPopover />
      </View>
    </View>
  );
}
