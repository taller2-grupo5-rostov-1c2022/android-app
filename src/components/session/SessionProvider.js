import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getAuth } from "firebase/auth";

export const SessionContext = React.createContext({
  user: null,
  signOut: () => {},
  update: async () => {},
  role: "listener",
  updateRole: async () => {},
});

export default function SessionProvider({ user, signOut, update, children }) {
  const [role, setRole] = useState("listener");

  async function updateRole(refresh = true) {
    try {
      const fb_user = getAuth()?.currentUser;
      let token = await fb_user?.getIdTokenResult(refresh);
      setRole(token.claims.role);
    } catch (e) {
      console.error("Could not get user role: ", e);
    }
  }

  useEffect(() => updateRole(false), [user?.id]);

  return (
    <SessionContext.Provider
      value={{
        user,
        signOut,
        update,
        role,
        updateRole,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

SessionProvider.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    pfp: PropTypes.string,
  }),
  signOut: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};
