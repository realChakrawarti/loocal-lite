import { parseVCard } from "@/shared/vcard";
import { CameraView } from "expo-camera";
import { Popover } from "heroui-native/popover";
import { useState } from "react";
import { View, StyleSheet, Text } from "react-native";

type ShareQRModalProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
};

export default function ScanQRModal({ open, setOpen }: ShareQRModalProps) {
  const [scanned, setScanned] = useState(false);

  const handleBarcodeScanned = ({ type, data }) => {
    setScanned(true);
    // alert(`Scanned QR type: ${type}\nData: ${data}`);
  };

  return (
    <Popover isOpen={open} onOpenChange={setOpen} presentation="bottom-sheet">
      <Popover.Portal>
        <Popover.Overlay />
        <Popover.Content contentContainerClassName="p-0" presentation="bottom-sheet">
          <View className="p-2 h-100">
            <View style={styles.container}>
              <CameraView
                ratio={"1:1"}
                onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
                barcodeScannerSettings={{
                  barcodeTypes: ["qr"],
                }}
                // style={StyleSheet.absoluteFillObject}
              />
              {/*{scanned && <Button title="Tap to Scan Again" onPress={() => setScanned(false)} />}*/}
            </View>
          </View>
        </Popover.Content>
      </Popover.Portal>
    </Popover>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
