import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import requestRecordPermission from "./permission";

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

// temporal token
const token =
  "00622d869523131488794257a1ec8d9eb2bIADRKLBaXNJkzCHtJJjX9gPAIJtaaN1DxiDrzGq/KnRXa98AXuMAAAAAEAA9DfJzFgSgYgEAAQAWBKBi";
const appId = "22d869523131488794257a1ec8d9eb2b";

export const StreamContext = createContext({
  startHosting: async () => {},
  startListening: async () => {},
  leaveLivestream: async () => {},
  peerIds: [],
  joined: false,
});

function Provider({ children }) {
  const [engine, setEngine] = useState(null);
  const [state, setState] = useState({
    joined: false,
    peerIds: [],
  });

  useEffect(() => {
    initEngine();
  }, []);

  async function initEngine() {
    const eng = await RtcEngine.create(appId);
    await eng.setChannelProfile(ChannelProfile.LiveBroadcasting);

    eng.addListener("Warning", (warn) => {
      console.log("Warning: ", warn);
    });

    eng.addListener("Error", (err) => {
      console.log("Error: ", err);
    });

    eng.addListener("UserJoined", (uid) => {
      const { peerIds } = state;
      if (peerIds.indexOf(uid) === -1)
        setState((prev) => {
          return {
            ...prev,
            peerIds: [...peerIds, uid],
          };
        });
    });

    eng.addListener("UserOffline", (uid) => {
      const { peerIds } = state;
      if (peerIds.indexOf(uid) === -1)
        setState((prev) => {
          return {
            ...prev,
            peerIds: peerIds.filter((id) => id !== uid),
          };
        });
    });

    eng.addListener("JoinChannelSuccess", () => {
      setState((prev) => ({
        ...prev,
        joined: true,
      }));
    });

    setEngine(eng);
  }

  async function startHosting(channelName) {
    if (!(await requestRecordPermission())) return;
    try {
      await engine?.setClientRole(ClientRole.Broadcaster);
      await engine?.joinChannel(token, channelName, null, 0);
    } catch (e) {
      console.error(e);
      toast.show("Could not start hosting a live stream");
    }
  }

  async function startListening(channelName) {
    try {
      await engine?.setClientRole(ClientRole.Audience);
      await engine?.joinChannel(token, channelName, null, 0);
    } catch (e) {
      console.error(e);
      toast.show("Could not start join a live stream");
    }
  }

  async function leaveLivestream() {
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
        leaveLivestream,
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
        leaveLivestream: notSupported,
        peerIds: [],
        joined: false,
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
