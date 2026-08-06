import { TagsType } from "@/database/types";
import type { Contact } from "expo-contacts";
import { createStore } from "zustand/vanilla";

type State = {
  contact: Contact | null;
  resizedImageUri: string | null;
  filterTags: string[];
  contactTags: TagsType[];
};

type Actions = {
  setContact: (contact: Contact) => void;
  setResizedImageUri: (uri: string | null) => void;
  reset: () => void;
  setFilterTags: (tagId: string) => void;
  setContactTags: (tags: TagsType[]) => void;
};

type ContactStore = State & Actions;

const contactStore = createStore<ContactStore>()((set, get, store) => ({
  contact: null,
  resizedImageUri: null,
  filterTags: [],
  setContact: (contact) => set({ contact: contact }),
  setResizedImageUri: (uri) => set({ resizedImageUri: uri }),
  reset: () => set(store.getInitialState()),
  setFilterTags: (tagId) => {
    if (get().filterTags.includes(tagId)) {
      const filtered = get().filterTags.filter((tag) => tag !== tagId);
      set({ filterTags: filtered });
    } else {
      set({ filterTags: [...get().filterTags, tagId] });
    }
  },
  contactTags: [],
  setContactTags: (tags) => set({ contactTags: tags }),
}));

export default contactStore;
