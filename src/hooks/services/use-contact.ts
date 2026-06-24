import log from "@/shared/logger";
import { Contact, requestPermissionsAsync, getPermissionsAsync } from "expo-contacts";
import * as Linking from "expo-linking";

async function openSettings() {
  Linking.openSettings();
}

async function requestContactPermission() {
  const status = await requestPermissionsAsync();
  if (!status.granted) {
    log.error("Contact permission denied!");
  }

  return status.granted;
}

async function contactPicker() {
  const selected = await Contact.presentPicker();
  if (selected) {
    return selected;
  }
}

async function getContactPermissionStatus() {
  const status = await getPermissionsAsync();
  return status;
}

export default function useContactService() {
  return {
    contactPicker,
    requestContactPermission,
    getContactPermissionStatus,
    openSettings,
  };
}
