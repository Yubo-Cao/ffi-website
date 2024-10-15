"use client";

import { isAdmin as checkIsAdmin } from "@/lib/user";
import { getAuth, User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext<{
  user: User;
  isAdmin: boolean;
}>({
  user: null,
  isAdmin: false,
});

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const auth = getAuth();
  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        checkIsAdmin(user.uid).then((result) => {
          setIsAdmin(result);
        });
      } else {
        setIsAdmin(false);
      }
    });
  }, [setUser, setIsAdmin, auth]);
  return (
    <UserContext.Provider value={{ user, isAdmin }}>
      {children}
    </UserContext.Provider>
  );
};

const useAuth = () => useContext(UserContext);

export { useAuth, UserProvider };
