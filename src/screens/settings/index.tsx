import configStore from "@/store/config-store";
import Lucide from "@react-native-vector-icons/lucide";
import { reloadAppAsync } from "expo";
import { useRouter } from "expo-router";
import { Description, ControlField, Label, Button } from "heroui-native";
import { ScrollView, View } from "react-native";
import { useStore } from "zustand";

export default function SettingScreen() {
  const biometricEnabled = useStore(configStore, (state) => state.biometricAuthentication);
  const setBiometricEnabled = configStore.getState().setBiometricAuthentication;

  const router = useRouter();

  return (
    <ScrollView className="bg-background p-4">
      <View className="gap-4">
        <ControlField
          isSelected={biometricEnabled}
          onSelectedChange={(selected) => setBiometricEnabled(selected)}
        >
          <View className="flex-1">
            <Label>Enable biometric</Label>
            <Description>Authenticate using biometric unlock mode</Description>
          </View>
          <ControlField.Indicator />
        </ControlField>
        <View className="flex flex-row justify-between items-center">
          <View className="flex-1">
            <Label>Tags editor</Label>
            <Description>Add and edit tags</Description>
          </View>
          <Button variant="ghost" onPress={() => router.push("/manage-tags")}>
            <Lucide name="external-link" color="black" size={24} />
          </Button>
        </View>
        <Button onPress={() => reloadAppAsync("Reloading application")} variant="primary">
          <Button.Label>Reload application</Button.Label>
        </Button>
      </View>
    </ScrollView>
  );
}
