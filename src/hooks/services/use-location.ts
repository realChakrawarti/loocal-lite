import log from "@/shared/logger";
import * as Location from "expo-location";
import { Linking } from "react-native";

export type LocationCoordinates = {
  longitude: number;
  latitude: number;
  timestamp: number;
};

async function openMappls(
  latitude: number,
  longitude: number,
  destinationName: string
) {
  const canOpenMappls = await Linking.canOpenURL("mappls://");
  if (canOpenMappls) {
    await Linking.openURL(
      `mappls://navigation?places=${latitude},${longitude},${destinationName}`
    );
  } else {
    await Linking.openURL(`https://www.mappls.com/@${latitude},${longitude}`);
  }
}

async function openGoogleMaps(
  latitude: number,
  longitude: number,
  destinationName: string
) {
  // Encode name for URL (replace spaces with +, etc.)
  const encodedName = encodeURIComponent(destinationName);

  const canOpenGMaps = await Linking.canOpenURL("google.navigation");
  if (canOpenGMaps) {
    await Linking.openURL(
      `google.navigation:q=${latitude},${longitude}(${encodedName})`
    );
  } else {
    const webUrl = `https://www.google.com/maps?q=${latitude},${longitude}(${encodedName})`;
    await Linking.openURL(webUrl);
  }
}

export default function useLocationService() {
  async function requestLocationPermission() {
    const status = await Location.requestForegroundPermissionsAsync();

    if (!status.granted) {
      log.error("Location permission denied!");
    }

    return status.granted;
  }

  async function isLocationServiceEnabled() {
    return await Location.hasServicesEnabledAsync();
  }

  async function getLocationPermissionStatus() {
    const status = await Location.getForegroundPermissionsAsync();
    return status;
  }

  async function enableLocationService() {
    await Location.enableNetworkProviderAsync();
  }

  async function getCurrentGPSLocation(): Promise<LocationCoordinates> {
    const location = await Location.getCurrentPositionAsync({});
    return {
      longitude: location.coords.longitude,
      latitude: location.coords.latitude,
      timestamp: location.timestamp,
    };
  }

  return {
    getLocationPermissionStatus,
    requestLocationPermission,
    getCurrentGPSLocation,
    openGoogleMaps,
    openMappls,
    isLocationServiceEnabled,
    enableLocationService,
  };
}