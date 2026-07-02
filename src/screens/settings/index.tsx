import configStore from "@/store/config-store";
import { reloadAppAsync } from "expo";
import { Checkbox, Description, ControlField, Label, Button } from "heroui-native";
import React from "react";
import { ScrollView, View } from "react-native";
import { useStore } from "zustand";

export default function ControlFieldExample() {
  const biometricEnabled = useStore(configStore, (state) => state.biometricAuthentication);

  const setBiometricEnabled = configStore.getState().setBiometricAuthentication;

  const [newsletter, setNewsletter] = React.useState(true);
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
        <ControlField isSelected={newsletter} onSelectedChange={setNewsletter}>
          <View className="flex-1">
            <Label>Subscribe to newsletter</Label>
          </View>
          <ControlField.Indicator>
            <Checkbox />
          </ControlField.Indicator>
        </ControlField>
        <Button onPress={() => reloadAppAsync("Reloading application")} variant="primary">
          <Button.Label>Reload application</Button.Label>
        </Button>
      </View>
    </ScrollView>
  );
}
