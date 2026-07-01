import { Tabs, useRouter } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { Button } from "heroui-native";

const iconSize = 20;

export default function TabsLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerRight: () => (
          <Button variant="ghost" onPress={() => router.push("/settings")}>
            <FontAwesome6 name="gears" size={24} color="black" />
          </Button>
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
          tabBarIcon: ({ color }) => <FontAwesome6 name="message" size={iconSize} color={color} />,
        }}
      />
      <Tabs.Screen
        name="locations"
        options={{
          title: "Locations",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="map-location-dot" size={iconSize} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
