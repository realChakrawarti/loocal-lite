import AddCTA from "@/components/add-cta";
import { FontAwesome6 } from "@expo/vector-icons";
import { ListGroup } from "heroui-native/list-group";
import { Separator } from "heroui-native/separator";
import useContactService from "@/hooks/services/use-contact";
import { useRef } from "react";
import { router } from "expo-router";
import { PopoverTriggerRef } from "heroui-native/popover";
import contactStore from "@/store/contact-store";

export function AddContactPopover() {
  const { contactPicker, requestContactPermission, getContactPermissionStatus, openSettings } =
    useContactService();

  const popoverRef = useRef<PopoverTriggerRef>(null);

  const setSelectedContact = contactStore.getState().setContact;

  async function openContantPicker() {
    const contact = await contactPicker();
    if (contact) {
      setSelectedContact(contact);
      popoverRef.current?.close();
      router.push("/edit-contact");
    }
  }

  async function handleContactPicker() {
    const contactPermissionStatus = await getContactPermissionStatus();

    if (contactPermissionStatus.granted) {
      await openContantPicker();
    } else if (contactPermissionStatus.canAskAgain && !contactPermissionStatus.granted) {
      const contactPermissionGranted = await requestContactPermission();
      if (contactPermissionGranted) {
        await openContantPicker();
      }
    } else {
      openSettings();
    }
  }

  function handleManualContact() {
    popoverRef.current?.close();
    router.push("/edit-contact");
  }

  return (
    <AddCTA ref={popoverRef}>
      <ListGroup>
        <ListGroup.Item onPress={handleContactPicker}>
          <ListGroup.ItemPrefix>
            <FontAwesome6 name="contact-book" size={24} color="black" />
          </ListGroup.ItemPrefix>
          <ListGroup.ItemContent>
            <ListGroup.ItemTitle>Contact Picker</ListGroup.ItemTitle>
            <ListGroup.ItemDescription>Pick contact from the contacts</ListGroup.ItemDescription>
          </ListGroup.ItemContent>
          <ListGroup.ItemSuffix />
        </ListGroup.Item>
        <Separator className="mx-2" />
        <ListGroup.Item onPress={handleManualContact}>
          <ListGroup.ItemPrefix>
            <FontAwesome6 name="contact-card" size={24} color="black" />
          </ListGroup.ItemPrefix>
          <ListGroup.ItemContent>
            <ListGroup.ItemTitle>Add contact</ListGroup.ItemTitle>
            <ListGroup.ItemDescription>Manually add a contact</ListGroup.ItemDescription>
          </ListGroup.ItemContent>
          <ListGroup.ItemSuffix />
        </ListGroup.Item>
      </ListGroup>
    </AddCTA>
  );
}
