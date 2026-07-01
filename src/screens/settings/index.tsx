import { Checkbox, Description, FieldError, ControlField, Label, Switch } from "heroui-native";
import React from "react";
import { ScrollView, View } from "react-native";
export default function ControlFieldExample() {
  const [notifications, setNotifications] = React.useState(false);
  const [terms, setTerms] = React.useState(false);
  const [newsletter, setNewsletter] = React.useState(true);
  return (
    <ScrollView className="bg-background p-4">
      <View className="gap-4">
        <ControlField isSelected={notifications} onSelectedChange={setNotifications}>
          <View className="flex-1">
            <Label>Enable notifications</Label>
            <Description>Receive push notifications about your account activity</Description>
          </View>
          <ControlField.Indicator />
        </ControlField>
        <ControlField
          isSelected={terms}
          onSelectedChange={setTerms}
          isInvalid={!terms}
          className="flex-col items-start gap-1"
        >
          <View className="flex-row items-center gap-2">
            <View className="flex-1">
              <Label>I agree to the terms and conditions</Label>
              <Description>By checking this box, you agree to our Terms of Service</Description>
            </View>
            <ControlField.Indicator className="mt-0.5">
              <Checkbox />
            </ControlField.Indicator>
          </View>
          <FieldError>This field is required</FieldError>
        </ControlField>
        <ControlField isSelected={newsletter} onSelectedChange={setNewsletter}>
          <View className="flex-1">
            <Label>Subscribe to newsletter</Label>
          </View>
          <ControlField.Indicator>
            <Checkbox />
          </ControlField.Indicator>
        </ControlField>
      </View>
    </ScrollView>
  );
}
