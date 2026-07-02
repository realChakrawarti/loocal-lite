import { createStore } from "zustand/vanilla";
import { persist, createJSONStorage } from "zustand/middleware";
import Storage from "expo-sqlite/kv-store";

type State = { biometricAuthentication: boolean };

type Actions = {
  setBiometricAuthentication: (state: boolean) => void;
};

type ConfigStore = State & Actions;

const configStore = createStore<ConfigStore>()(
  persist(
    (set) => ({
      biometricAuthentication: false,
      setBiometricAuthentication: (state) => set({ biometricAuthentication: state }),
    }),
    { name: "config-store", storage: createJSONStorage(() => Storage) }
  )
);

export default configStore;
