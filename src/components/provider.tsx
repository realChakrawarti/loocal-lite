import { PropsWithChildren } from "react";
import { HeroUINativeProvider } from "heroui-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Uniwind } from "uniwind";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { KeyboardProvider } from "react-native-keyboard-controller";

const config = {
  devInfo: {
    // Disable styling principles information message
    stylingPrinciples: false,
  },
  textProps: {
    // Allow font scaling for accessibility
    allowFontScaling: true,
    // But limit maximum scale
    maxFontSizeMultiplier: 1.5,
  },
};

export default function Provider({ children }: PropsWithChildren) {
  Uniwind.setTheme("light");
  const queryClient = new QueryClient();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HeroUINativeProvider config={config}>
        <SafeAreaProvider>
          <QueryClientProvider client={queryClient}>
            <SafeAreaView style={{ flex: 1 }}>
              <KeyboardProvider>{children}</KeyboardProvider>
            </SafeAreaView>
          </QueryClientProvider>
        </SafeAreaProvider>
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}
