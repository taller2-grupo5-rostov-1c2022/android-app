import { useEffect, useState, useContext } from "react";
import { AudioContext } from "../general/AudioProvider.js";

let LIVE_SUPPORTED = false;
let RtcEngine, ClientRole, ChannelProfile;
try {
  const module = require("react-native-agora");
  RtcEngine = module.default;
  ClientRole = module.ClientRole;
  ChannelProfile = module.ChannelProfile;
  LIVE_SUPPORTED = true;
} catch {
  console.log("Live streams not supported on this platform");
}

const APP_ID = "22d869523131488794257a1ec8d9eb2b";

// channelName: a que canal conectar (string)
// token: token de autenticación (string)
// host: hostear o escuchar (bool)
function useStreamings(channelName, token, host) {
  const [engine, setEngine] = useState(null);
  const [joined, setJoined] = useState(false);
  const music = useContext(AudioContext);

  useEffect(() => {
    music.setPaused(true);
    try {
      let stop = initEngine();
      return async () => {
        (await stop)();
      };
    } catch (e) {
      console.error(e);
      toast.show(`Could not ${host ? "start" : "join"} a live stream`);
    }
  }, []);

  async function initEngine() {
    const eng = await RtcEngine.create(APP_ID);
    setEngine(eng);

    await eng.setChannelProfile(ChannelProfile.LiveBroadcasting);

    const sub_warn = eng.addListener("Warning", (warn) => {
      console.warn("Warning: ", warn);
    });

    const sub_err = eng.addListener("Error", (err) => {
      console.warn("Error: ", err);
    });

    const sub_list = eng.addListener("JoinChannelSuccess", () => {
      setJoined(true);
    });

    await eng.setClientRole(
      host ? ClientRole.Broadcaster : ClientRole.Audience
    );
    await eng.joinChannel(token, channelName, null, 0);

    return () => {
      eng.leaveChannel();
      sub_warn.remove();
      sub_err.remove();
      sub_list.remove();
      eng.destroy();
    };
  }

  return { engine, joined };
}

function useStreamingsNotSupported() {
  useEffect(() => {
    toast.show("Live streams not supported on this platform");
  }, []);

  return {
    hostJoined: true,
    joined: true,
    engine: null,
  };
}

const hook = LIVE_SUPPORTED ? useStreamings : useStreamingsNotSupported;
export default hook;
