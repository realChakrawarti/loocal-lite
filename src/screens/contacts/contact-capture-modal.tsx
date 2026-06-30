import useCamera from "@/hooks/services/use-camera";
import { CameraView } from "expo-camera";
import { Button } from "heroui-native/button";
import { PropsWithChildren, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import ViewModal from "@/components/modal";
import contactStore from "@/store/contact-store";
import { FontAwesome6 } from "@expo/vector-icons";
import { useEffectOnce } from "@/hooks/use-effect-once";
import { deleteImage, resizeImage } from "@/shared/image-utils";

interface ContactCaptureModalProps extends PropsWithChildren {
  setShowCameraModal: (value: boolean) => void;
  showCameraModal: boolean;
}

export default function ContactCaptureModal({
  setShowCameraModal,
  showCameraModal,
}: ContactCaptureModalProps) {
  const { requestCameraPermission, cameraRef, capture } = useCamera();

  const [frontCamera, setFrontCamera] = useState(true);
  const [imageUri, setImageUrl] = useState<string | null>(null);
  const [openCamera, setOpenCamera] = useState(false);

  const setResizedImageUri = contactStore.getState().setResizedImageUri;

  useEffectOnce(() => {
    requestCameraPermission();
  });

  async function handleTakePicture() {
    const { granted } = await requestCameraPermission();
    if (granted) {
      const image = await capture();
      if (image) {
        setImageUrl(image);
      }
    }
    return;
  }

  async function savePreviewImage(imageUri: string | null) {
    if (imageUri) {
      const resizedImageUri = await resizeImage(imageUri, { width: 128, height: 128 });
      setResizedImageUri(resizedImageUri);
      setImageUrl(null);
      setShowCameraModal(false);
    }
  }

  async function retake() {
    setOpenCamera(true);
    if (imageUri) {
      deleteImage(imageUri);
      setImageUrl(null);
    }
  }

  return (
    <ViewModal label="Capture Photo" visible={showCameraModal} setVisible={setShowCameraModal}>
      <View className="relative flex-1 justify-center">
        <View style={styles.container}>
          <View className="flex-1 relative">
            {!openCamera && !imageUri && (
              <Button onPress={() => setOpenCamera(true)}>Open Camera</Button>
            )}
            {openCamera && !imageUri ? (
              <View className="relative aspect-square">
                <CameraView
                  ratio="1:1"
                  style={styles.camera}
                  facing={frontCamera ? "front" : "back"}
                  ref={cameraRef}
                />
                <View className="absolute bottom-1 flex flex-row h-14 w-full justify-center">
                  <Button
                    variant="outline"
                    className="absolute flex flex-row items-center justify-center size-14 rounded-full"
                    onPress={handleTakePicture}
                  >
                    <View className="size-12 bg-amber-100 rounded-full" />
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
            ) : null}
            {imageUri && (
              <View className="flex-1 gap-3">
                <Image
                  // className="aspect-square rounded-xl"
                  style={styles.preview}
                  source={{ uri: imageUri }}
                />
                <View className="flex flex-row gap-3 items-center">
                  <Button
                    className="grow"
                    variant="outline"
                    isDisabled={!imageUri}
                    onPress={retake}
                  >
                    Retake
                  </Button>
                  <Button
                    className="grow-3"
                    isDisabled={!imageUri}
                    onPress={() => savePreviewImage(imageUri)}
                  >
                    Save preview
                  </Button>
                </View>
                <Text>{imageUri}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </ViewModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    flexShrink: 1,
    gap: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "orangered",
  },
  camera: { aspectRatio: 1, borderRadius: 12 },
  preview: {
    borderRadius: 12,
    aspectRatio: 1,
  },
});
