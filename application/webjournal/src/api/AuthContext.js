import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import { auth } from "./firebase";

export const AuthContext = React.createContext();

export const AuthContextProvider = ({ children }) => {
  // Initially set user to null or undefined, we will set it in useEffect
  const [user, setUser] = useState(null);

  // Log out user
  const logOut = async () => {
    await signOut(auth);
    setUser(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem('user');
    }
  };

  // On login, set the user and save to localStorage
  const onLogin = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const loggedInUser = userCredential.user;
      setUser(loggedInUser);
      if (typeof window !== "undefined") {
        window.localStorage.setItem('user', 'true');
      }
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage);
    }
  };

  // Set user from localStorage only after the component is mounted (client-side)
  useEffect(() => {
    // Check if window is defined to prevent SSR issues
    if (typeof window !== "undefined") {
      const storedUser = window.localStorage.getItem("user");
      if (storedUser === "true") {
        setUser(true);
      }
    }

    // Subscribe to Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        if (typeof window !== "undefined") {
          window.localStorage.setItem('user', 'true');
        }
      } else {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem('user');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, logOut, onLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
