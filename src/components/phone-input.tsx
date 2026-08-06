import MaterialCommunityIcons from "@react-native-vector-icons/material-design-icons";
import { InputGroup, InputGroupInputProps } from "heroui-native/input-group";
import { KeyboardAvoidingView, Pressable } from "react-native";

interface PhoneInputProps extends InputGroupInputProps {
  trigger: () => void;
}

export default function PhoneInput({ trigger, ...props }: PhoneInputProps) {
  return (
    <KeyboardAvoidingView behavior={undefined} style={{ flex: 1 }}>
      <InputGroup>
        <InputGroup.Prefix isDecorative>
          <MaterialCommunityIcons name="dialpad" size={20} color="black" />
        </InputGroup.Prefix>
        <InputGroup.Input
          value={props.value}
          onChangeText={props.onChangeText}
          placeholder={props.placeholder}
          {...props}
        />
        <InputGroup.Suffix>
          <Pressable onPress={trigger} hitSlop={20}>
            <MaterialCommunityIcons
              name="phone-remove"
              size={20}
              color="black"
            />
          </Pressable>
        </InputGroup.Suffix>
      </InputGroup>
    </KeyboardAvoidingView>
  );
}