import { PermissionsAndroid } from "react-native";
import { Platform } from "react-native";

export default async function requestRecordPermission() {
  if (Platform.OS != "android") return true;

  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);
    if (
      granted["android.permission.RECORD_AUDIO"] ==
      PermissionsAndroid.RESULTS.GRANTED
    )
      return true;
  } catch (err) {
    console.error(err);
    toast.show("Internal error");
  }

  return false;
}
