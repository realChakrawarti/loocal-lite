import useCamera from "@/hooks/services/use-camera";
import { CameraView } from "expo-camera";
import { Button } from "heroui-native/button";
import { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { useEffectOnce } from "@/hooks/use-effect-once";
import { parseVCard } from "@/shared/vcard";

export default function ScanQRPage() {
  const { requestCameraPermission, cameraRef } = useCamera();
  const [openCamera, setOpenCamera] = useState(false);
  const [parsed, setParsed] = useState<ReturnType<typeof parseVCard>>();

  useEffectOnce(() => {
    requestCameraPermission();
  });

  const handleBarcodeScanned = ({ type, data }) => {
    const normalizedString = data.replace(/\r?\n/g, "\r\n");

    // Ensure the string ends with a CRLF as well (strict RFC compliance)
    const finalString = normalizedString.endsWith("\r\n")
      ? normalizedString
      : normalizedString + "\r\n";
    setParsed(parseVCard(finalString));

    // alert(`Scanned QR type: ${type}\nData: ${data}`);
  };

  return (
    // <ViewModal label="Capture Photo" visible={showCameraModal} setVisible={setShowCameraModal}>
    <View className="relative flex-1 justify-center">
      <View style={styles.container}>
        <View className="flex-1 relative">
          {!openCamera && <Button onPress={() => setOpenCamera(true)}>Open Camera</Button>}
          {openCamera ? (
            <View className="relative aspect-square">
              <CameraView
                ratio="1:1"
                style={styles.camera}
                facing="back"
                ref={cameraRef}
                onBarcodeScanned={handleBarcodeScanned}
                barcodeScannerSettings={{
                  barcodeTypes: ["qr"],
                }}
              />
              <View className="absolute bottom-1 flex flex-row h-14 w-full justify-center">
                {parsed ? <Text>{JSON.stringify(parsed, null, 2)}</Text> : null}
              </View>
            </View>
          ) : null}
        </View>
      </View>
    </View>
    // </ViewModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    flexShrink: 1,
    gap: 12,
  },
  camera: { aspectRatio: 1, borderRadius: 12 },
  preview: {
    borderRadius: 12,
    aspectRatio: 1,
  },
});
