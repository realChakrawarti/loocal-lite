import { FontAwesome6 } from "@expo/vector-icons";
import { Button } from "heroui-native/button";
import { Popover, PopoverTriggerRef } from "heroui-native/popover";
import { PropsWithChildren, RefObject } from "react";

export default function AddCTA({
  ref,
  children,
}: { ref?: RefObject<PopoverTriggerRef | null> } & PropsWithChildren) {
  return (
    <Popover presentation="bottom-sheet">
      <Popover.Trigger ref={ref} asChild>
        <Button className="size-13 flex justify-center items-center rounded-full">
          <FontAwesome6 name="add" size={20} color={"#fff"} />
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Overlay />
        <Popover.Content contentContainerClassName="p-0" presentation="bottom-sheet">
          {children}
        </Popover.Content>
      </Popover.Portal>
    </Popover>
  );
}
