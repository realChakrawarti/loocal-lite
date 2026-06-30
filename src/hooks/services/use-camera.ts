import { CameraView, useCameraPermissions } from "expo-camera";

import { useRef } from "react";

export default function useCamera() {
  const [getCameraPermissionStatus, requestCameraPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const capture = async () => {
    if (!cameraRef.current) return null;

    const photo = await cameraRef.current.takePictureAsync();
    if (!photo) return null;
    return photo.uri;
  };

  return {
    getCameraPermissionStatus,
    requestCameraPermission,
    cameraRef,
    capture,
  };
}
