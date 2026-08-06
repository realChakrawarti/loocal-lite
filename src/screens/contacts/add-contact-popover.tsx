import AddCTA from "@/components/add-cta";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { ListGroup } from "heroui-native/list-group";
import { Separator } from "heroui-native/separator";
import useContactService from "@/hooks/services/use-contact";
import { useRef, useState } from "react";
import { router } from "expo-router";
import { PopoverTriggerRef } from "heroui-native/popover";
import contactStore from "@/store/contact-store";
import ScanQRModal from "./scan-qr-modal";

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

  function handleQRCode() {
    popoverRef.current?.close();
    router.push("/scan-qr");
  }

  return (
    <>
      <AddCTA ref={popoverRef}>
        <ListGroup>
          <ListGroup.Item onPress={handleContactPicker}>
            <ListGroup.ItemPrefix>
              <MaterialDesignIcons name="phone-log" size={24} color="black" />
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
              <MaterialDesignIcons name="phone-plus" size={24} color="black" />
            </ListGroup.ItemPrefix>
            <ListGroup.ItemContent>
              <ListGroup.ItemTitle>Add contact</ListGroup.ItemTitle>
              <ListGroup.ItemDescription>Manually add a contact</ListGroup.ItemDescription>
            </ListGroup.ItemContent>
            <ListGroup.ItemSuffix />
          </ListGroup.Item>
          <Separator className="mx-2" />
          <ListGroup.Item onPress={handleQRCode}>
            <ListGroup.ItemPrefix>
              <MaterialDesignIcons name="qrcode" size={24} color="black" />
            </ListGroup.ItemPrefix>
            <ListGroup.ItemContent>
              <ListGroup.ItemTitle>Scan QR code</ListGroup.ItemTitle>
              <ListGroup.ItemDescription>Scan a QR code to add contact</ListGroup.ItemDescription>
            </ListGroup.ItemContent>
            <ListGroup.ItemSuffix />
          </ListGroup.Item>
        </ListGroup>
      </AddCTA>
    </>
  );
}
