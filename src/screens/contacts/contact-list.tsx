import { Column, Host, RNHostView, ScrollView } from "@expo/ui";
import { View, Text } from "react-native";

export function ContactList() {
  return (
    <Host style={{ flex: 1 }}>
      <ScrollView style={{ padding: 2 }}>
        <Column spacing={8}>
          {Array.from({ length: 100 }).map((_, i) => (
            <RNHostView matchContents key={i}>
              <View className="h-auto border border-border p-2 w-full">
                <Text>Row {i + 1}</Text>
              </View>
            </RNHostView>
          ))}
        </Column>
      </ScrollView>
    </Host>
  );
}
