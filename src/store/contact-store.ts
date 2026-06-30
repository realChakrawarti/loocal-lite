import type { Contact } from "expo-contacts";
import { createStore } from "zustand/vanilla";

type State = { contact: Contact | null; resizedImageUri: string | null };

type Actions = {
  setContact: (contact: Contact) => void;
  setResizedImageUri: (uri: string | null) => void;
  reset: () => void;
};

type ContactStore = State & Actions;

const contactStore = createStore<ContactStore>()((set, _get, store) => ({
  contact: null,
  resizedImageUri: null,
  setContact: (contact) => set({ contact: contact }),
  setResizedImageUri: (uri) => set({ resizedImageUri: uri }),
  reset: () => set(store.getInitialState()),
}));

export default contactStore;
