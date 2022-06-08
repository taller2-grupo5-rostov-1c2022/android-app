import React, { createContext, useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";
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

export const StreamContext = createContext({
  startHosting: async () => {},
  startListening: async () => {},
  leaveLivestream: async () => {},
  joined: false,
  engine: null,
});

function Provider({ children }) {
  const [engine, setEngine] = useState(null);
  const [state, setState] = useState({
    joined: false,
    hostJoined: false,
  });
  const music = useContext(AudioContext);

  useEffect(() => {
    initEngine();
  }, []);

  async function initEngine() {
    const eng = await RtcEngine.create(APP_ID);
    await eng.setChannelProfile(ChannelProfile.LiveBroadcasting);

    eng.addListener("Warning", (warn) => {
      console.log("Warning: ", warn);
    });

    eng.addListener("Error", (err) => {
      console.log("Error: ", err);
    });

    eng.addListener("JoinChannelSuccess", () => {
      setState((prev) => ({
        ...prev,
        joined: true,
      }));
    });

    setEngine(eng);
  }

  async function startHosting(channelName, token) {
    music.setPaused(true);
    await engine?.setClientRole(ClientRole.Broadcaster);
    await engine?.joinChannel(token, channelName, null, 0);
    return true;
  }

  async function startListening(channelName, token) {
    try {
      music.setPaused(true);
      await engine?.setClientRole(ClientRole.Audience);
      await engine?.joinChannel(token, channelName, null, 0);
    } catch (e) {
      console.error(e);
      toast.show("Could not start join a live stream");
    }
  }

  async function stop() {
    try {
      await engine?.leaveChannel();
      setState((prev) => ({ ...prev, joined: false }));
    } catch (e) {
      console.error(e);
      toast.show("Could not leave live stream");
    }
  }

  return (
    <StreamContext.Provider
      value={{
        startHosting,
        startListening,
        stop,
        engine,
        ...state,
      }}
    >
      {children}
    </StreamContext.Provider>
  );
}

const notSupported = () =>
  toast.show("Live streams not supported on this platform");

function NotSupportedProvider({ children }) {
  return (
    <StreamContext.Provider
      value={{
        startHosting: notSupported,
        startListening: notSupported,
        stop: notSupported,
        hostJoined: true,
        joined: true,
        engine: null,
      }}
    >
      {children}
    </StreamContext.Provider>
  );
}

const StreamProvider = LIVE_SUPPORTED ? Provider : NotSupportedProvider;
export default StreamProvider;

NotSupportedProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

Provider.propTypes = {
  children: PropTypes.node.isRequired,
};
