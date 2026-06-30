import { File, Paths } from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { SaveFormat, ImageManipulator } from "expo-image-manipulator";

export async function saveImageDisk(url: string, filename: string) {
  const destinationFile = new File(Paths.document, filename);

  if (!destinationFile.exists) {
    await File.downloadFileAsync(url, destinationFile);
  }

  return destinationFile.uri;
}

type Dimension = {
  width: number;
  height: number;
};

export async function resizeImage(uri: string, dimension: Dimension) {
  const context = ImageManipulator.manipulate(uri);
  context.resize(dimension);
  const imageRef = await context.renderAsync();
  const resized = await imageRef.saveAsync({ format: SaveFormat.JPEG });
  const destination = new File(Paths.document, `photo_${Date.now()}.jpg`);
  const resizedFile = new File(resized.uri);
  resizedFile.copy(destination, { overwrite: true });

  return destination.uri;
}

export function deleteImage(uri: string) {
  const file = new File(uri);
  file.delete();
}

export async function imagePicker() {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (!result.canceled) {
    return result.assets[0].uri;
  }

  return null;
}
