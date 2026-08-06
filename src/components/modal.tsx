import Ionicons from "@react-native-vector-icons/ionicons";
import { Button } from "heroui-native";
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
        <View className="flex flex-1 justify-end p-4">
          <View className="flex h-24 flex-row items-center gap-8">
            <Button onTouchEnd={() => setVisible(false)} variant="ghost">
              <Ionicons name="arrow-back-outline" size={24} color="black" />
            </Button>
            <Text className="text-lg">{label}</Text>
          </View>
          {children}
        </View>
      </SafeAreaView>
    </Modal>
  );
}
