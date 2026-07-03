import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function DetailsContactModal() {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <Text>Contact Details: {id}</Text>
    </View>
  );
}
