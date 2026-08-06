import { Dialog } from "heroui-native/dialog";
import { TextField } from "heroui-native/text-field";
import { Button } from "heroui-native/button";
import { Label } from "heroui-native/label";
import { Input } from "heroui-native/input";
import { View } from "react-native";

type AddEditFormProps = {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
  value: string;
  changeValue: (value: string) => void;
  onSubmit: () => void;
};

export default function AddEditForm({
  isOpen,
  setIsOpen,
  value,
  changeValue,
  onSubmit,
}: AddEditFormProps) {
  return (
    <Dialog isOpen={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content className="bg-background">
          <View className="gap-4">
            <TextField isRequired>
              <Label>Tag name</Label>
              <Input
                className="text-base"
                value={value}
                onChangeText={changeValue}
                placeholder="Tag name"
              />
            </TextField>
            <Button onPress={onSubmit}>Submit</Button>
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
