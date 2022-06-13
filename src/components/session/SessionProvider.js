import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getAuth } from "firebase/auth";
import { fetch, BALANCE_URL } from "../../util/services";

export const SessionContext = React.createContext({
  user: null,
  signOut: () => {},
  update: async () => {},
  role: "listener",
  updateRole: async () => {},
  balance: "0",
  updateBalance: async () => {},
});

export default function SessionProvider({ user, signOut, update, children }) {
  const [role, setRole] = useState("listener");
  const [balance, setBalance] = useState("0");

  async function updateRole(refresh = true) {
    try {
      const fb_user = getAuth()?.currentUser;
      const token = await fb_user?.getIdTokenResult(refresh);
      setRole(token.claims.role);
    } catch (e) {
      console.error("Could not get user role: ", e);
    }
  }

  async function updateBalance() {
    try {
      const balance = await fetch(BALANCE_URL);
      setBalance(balance?.balance ?? "unknown");
    } catch (e) {
      console.error("Could not get user balance: ", e);
    }
  }

  useEffect(() => {
    updateRole(false);
    updateBalance();
  }, [user?.id]);

  return (
    <SessionContext.Provider
      value={{
        user,
        signOut,
        update,
        role,
        updateRole,
        balance,
        updateBalance,
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
