import { PermissionsAndroid } from "react-native";
import { Platform } from "react-native";

export default async function requestRecordPermission() {
  if (Platform.OS != "android") return;

  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);
    if (
      granted["android.permission.RECORD_AUDIO"] ==
      PermissionsAndroid.RESULTS.GRANTED
    )
      return true;

    toast.show("You need to enable microphone to host a live stream");
  } catch (err) {
    toast.show("Internal error");
  }

  return false;
}
