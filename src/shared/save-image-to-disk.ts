import { File, Paths } from "expo-file-system";

export default async function saveImageDisk(url: string, filename: string) {
  const destinationFile = new File(Paths.document, filename);

  if (!destinationFile.exists) {
    await File.downloadFileAsync(url, destinationFile);
  }

  return destinationFile.uri;
}
