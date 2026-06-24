import useCamera from "@/hooks/services/use-camera";
import { CameraView } from "expo-camera";
import { Button } from "heroui-native/button";
import { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import ViewModal from "@/widgets/modal";
import contactStore from "@/store/contact-store";
import { FontAwesome6 } from "@expo/vector-icons";
import { useEffectOnce } from "@/hooks/use-effect-once";

export default function ContactCaptureModal() {
  const { requestCameraPermission, cameraRef, capture } = useCamera();
  const [showCameraView, setShowCameraView] = useState(false);
  const [frontCamera, setFrontCamera] = useState(true);
  const [imageUri, setImageUrl] = useState<string | null>(null);

  const setCapturedImageUri = contactStore.getState().setCapturedImageUri;

  useEffectOnce(() => {
    requestCameraPermission();
  });

  async function handleTakePicture() {
    const { granted } = await requestCameraPermission();
    if (granted) {
      const imageUri = await capture();
      if (imageUri) {
        setImageUrl(imageUri);
      }
    }
    return;
  }

  async function savePreviewImage(imageUri: string | null) {
    if (imageUri) {
      setCapturedImageUri(imageUri);
      setShowCameraView(false);
    }
  }

  return (
    <>
      <Button onPress={() => setShowCameraView(true)} variant="outline">
        <Text>Take picture</Text>
      </Button>
      <ViewModal label="Capture Photo" visible={showCameraView} setVisible={setShowCameraView}>
        <View className="flex-1 justify-center relative">
          <View style={styles.container}>
            <CameraView
              style={styles.camera}
              facing={frontCamera ? "front" : "back"}
              ref={cameraRef}
            />
            <View className="flex flex-row items-center gap-3">
              <Button className="relative" onPress={handleTakePicture}>
                Capture
              </Button>
              <Button isDisabled={!imageUri} onPress={() => savePreviewImage(imageUri)}>
                Save preview
              </Button>
            </View>
            <Button
              className="absolute"
              variant="ghost"
              onPress={() => setFrontCamera(!frontCamera)}
            >
              <FontAwesome6 name="camera-rotate" size={24} color="#fef3c6" />
            </Button>
          </View>
          {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}
        </View>
      </ViewModal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    position: "relative",
    flexShrink: 1,
    gap: 12,
  },
  camera: { aspectRatio: 1, borderRadius: 12 },
  preview: {
    position: "absolute",
    right: 0,
    bottom: 0,
    height: 128,
    aspectRatio: 1,
    borderRadius: 12,
  },
});
