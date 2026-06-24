import Ionicons from "@expo/vector-icons/Ionicons";
import { PropsWithChildren } from "react";
import { Modal, View, Text, ModalProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ViewModalProps extends ModalProps, PropsWithChildren {
  visible: boolean;
  setVisible: (visibility: boolean) => void;
  label?: string;
}

export default function ViewModal({
  children,
  visible,
  setVisible,
  label = "",
  ...rest
}: ViewModalProps) {
  return (
    <Modal visible={visible} {...rest}>
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex flex-1 px-4 justify-end">
          <View className="flex flex-row items-center h-24 gap-8">
            <Ionicons
              onTouchEnd={() => setVisible(false)}
              name="arrow-back-outline"
              size={24}
              color="black"
            />
            <Text className="text-lg">{label}</Text>
          </View>
          {children}
        </View>
      </SafeAreaView>
    </Modal>
  );
}
