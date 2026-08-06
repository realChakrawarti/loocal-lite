import { Tabs, useRouter } from "expo-router";
import Lucide from "@react-native-vector-icons/lucide";
import { TouchableOpacity } from "react-native";
import { Button } from "heroui-native";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";

const iconSize = 20;

export default function TabsLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerRight: () => (
          <Button variant="ghost" onPress={() => router.push("/settings")}>
            <Lucide name="settings-2" size={24} color="black" />
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
            <MaterialDesignIcons name="phone" size={iconSize} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: "Chats",
          tabBarIcon: ({ color }) => (
            <MaterialDesignIcons name="message" size={iconSize} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="locations"
        options={{
          title: "Locations",
          tabBarIcon: ({ color }) => (
            <MaterialDesignIcons name="map" size={iconSize} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
