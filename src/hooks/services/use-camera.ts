import { CameraView, useCameraPermissions } from "expo-camera";
import { SaveFormat, ImageManipulator } from "expo-image-manipulator";
import { useRef } from "react";
import { File, Paths } from "expo-file-system";

export default function useCamera() {
  const [getCameraPermissionStatus, requestCameraPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const capture = async () => {
    if (!cameraRef.current) return null;

    const photo = await cameraRef.current.takePictureAsync();
    if (!photo) return null;

    const context = ImageManipulator.manipulate(photo.uri);
    context.resize({ height: 128 });
    const imageRef = await context.renderAsync();
    const resized = await imageRef.saveAsync({ format: SaveFormat.JPEG });

    const destination = new File(Paths.document, `photo_${Date.now()}.jpg`);
    const resizedFile = new File(resized.uri);
    resizedFile.copy(destination);

    return destination.uri;
  };

  return { getCameraPermissionStatus, requestCameraPermission, cameraRef, capture };
}
