import { Tabs } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";

import { reloadAppAsync } from "expo";
import { TouchableOpacity } from "react-native";
import { Button } from "heroui-native";

const iconSize = 20;

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerRight: () => (
          <Button
            className="size-12 rounded-r-none text-cyan-700"
            onPress={() => reloadAppAsync("Reloading app")}
          />
        ),
        tabBarPosition: "bottom",
        tabBarStyle: { height: 60 },
        tabBarButton: (props) => <TouchableOpacity {...(props as any)} />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Contacts",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="contact-book" size={iconSize} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: "Chats",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="message" size={iconSize} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="locations"
        options={{
          title: "Locations",
          tabBarIcon: ({ color }) => (
            <FontAwesome6
              name="map-location-dot"
              size={iconSize}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}