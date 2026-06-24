import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import "../global.css";
import useSplashInitialize from "@/hooks/use-splash-initialize";
import Provider from "@/widgets/provider";
import contactStore from "@/store/contact-store";

export default function RootLayout() {
  const { isReady } = useSplashInitialize();
  const resetContactStore = contactStore.getState().reset;

  if (!isReady) {
    return null;
  }

  return (
    <Provider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen
          name="edit-contact"
          listeners={{
            beforeRemove: () => {
              resetContactStore();
            },
          }}
          options={{
            headerLargeTitleEnabled: true,
            title: "Edit Contact",
            headerShown: true,
            presentation: "modal",
            animation: "slide_from_bottom",
          }}
        />
      </Stack>
      <StatusBar style="light" />
    </Provider>
  );
}
