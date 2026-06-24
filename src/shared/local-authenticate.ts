import * as LocalAuthentication from "expo-local-authentication";

export async function localAuthenticate() {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();

  if (!hasHardware || !isEnrolled) {
    console.log("Biometric authentication not available");
    return;
  }

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: "Authenticate to continue",
    cancelLabel: "Cancel",
    disableDeviceFallback: false,
  });

  if (result.success) {
    console.log("Authenticated successfully!");
    return;
  }

  throw Error(result.error);
}
