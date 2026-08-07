import useCamera from "@/hooks/services/use-camera";
import { BarcodeScanningResult, CameraView } from "expo-camera";
import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useEffectOnce } from "@/hooks/use-effect-once";
import { parseVCard } from "@/shared/vcard";
import { ContactNumber } from "@/database/types";
import { Button } from "heroui-native/button";
import { MaterialIcons } from "@react-native-vector-icons/material-icons/static";
import { useRouter } from "expo-router";

// TODO: Add thumbnail?
type ParsedQRType = {
  fullname: string;
  phones: ContactNumber[];
  remarks: string;
};

function normalizeQR(contact: any): ParsedQRType {
  const fn = contact.parsedVcard.find((item: any) => item.property === "FN");
  const xloocal = contact.parsedVcard.find((item: any) => item.property === "X-LOOCAL");
  const note = contact.parsedVcard.find((item: any) => item.property === "NOTE");

  const cn = JSON.parse(xloocal.value);

  return {
    fullname: fn.value,
    phones: cn.phones.map((phone: { number: string; whatsapp: boolean }) => ({
      number: phone.number,
      platform: { whatsapp: phone.whatsapp },
    })),
    remarks: note.value,
  };
}

export default function ScanQRPage() {
  const { requestCameraPermission, cameraRef } = useCamera();
  const [parsed, setParsed] = useState<ParsedQRType | null>(null);
  const router = useRouter();

  useEffectOnce(() => {
    requestCameraPermission();
  });

  const handleBarcodeScanned = ({ raw }: BarcodeScanningResult) => {
    if (raw) {
      const normalizedRaw = raw?.replace(/\r?\n/g, "\r\n");
      const parsedRaw = parseVCard(normalizedRaw);
      const normalizedQR = normalizeQR(parsedRaw);
      setParsed(normalizedQR);
    }
  };

  console.log("<< : Parsed QR data", JSON.stringify(parsed, null, 2));

  return (
    <View className="relative flex-1 justify-center mt-10 p-2">
      <View style={styles.container}>
        <View className="flex-1 relative">
          <View className="relative aspect-square">
            {parsed ? (
              <Button
                onPress={() => {
                  router.push({
                    pathname: "/edit-contact",
                    params: {
                      type: "qr",
                      fullname: parsed.fullname,
                      contactPhones: JSON.stringify(parsed.phones),
                      remarks: parsed.remarks,
                    },
                  });
                }}
                variant="outline"
                className="absolute bottom-5 z-10 right-5"
              >
                <MaterialIcons name="add" size={18} color="#fff" />
                <Button.Label className="text-sm text-white font-semibold">
                  {parsed.fullname}
                </Button.Label>
              </Button>
            ) : null}
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
          </View>
        </View>
      </View>
    </View>
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
});
