import type { Contact } from "expo-contacts";
import { createStore } from "zustand/vanilla";

type State = { contact: Contact | null; capturedImageUri: string | null };

type Actions = {
  setContact: (contact: Contact) => void;
  setCapturedImageUri: (uri: string) => void;
  reset: () => void;
};

type ContactStore = State & Actions;

const contactStore = createStore<ContactStore>()((set, _get, store) => ({
  contact: null,
  capturedImageUri: null,
  setContact: (contact) => set({ contact: contact }),
  setCapturedImageUri: (uri) => set({ capturedImageUri: uri }),
  reset: () => set(store.getInitialState()),
}));

export default contactStore;
