"use client";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import SpotifyAuth from "./spotify-auth";
import SpotifyRequest from "./spotify-request";

//remove the token refresh from useffect
//remove the message too  
function CreatePlaylistHome() {
  const [message, setMessage] = useState("Loading");
  const [user, setUser] = useState(null);
  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
  const [spotifyToken, setSpotifyToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
  
        try {
          const idToken = await currentUser.getIdToken();
          const response = await fetch("http://localhost:8080/api/home", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
            credentials: "include",
          });
  
          const data = await response.json();
          console.log("Server Response Data:", data);
  
          if (response.ok) {
            setSpotifyAuthenticated(true);
            setSpotifyToken(data.spotifyAccessToken);
            setRefreshToken(data.spotifyRefreshToken);
            console.log("Spotify Access Token:", data.spotifyAccessToken);
            console.log("Spotify Refresh Token:", data.spotifyRefreshToken);
            setMessage("Authenticated with Firebase and Spotify.");
          } else {
            setSpotifyAuthenticated(false);
            setMessage(data.error || "Spotify not authenticated.");
          }
        } catch (error) {
          console.error("Error checking authentication:", error);
          setMessage("Failed to authenticate.");
        }
      } else {
        setUser(null);
        setSpotifyAuthenticated(false);
        setMessage("User not authenticated");
      }
    });
  
    return () => unsubscribe();
  }, []);

  if (!user) {
    return <div>{message}</div>;
  }

  return spotifyAuthenticated ? (
    <SpotifyAuth
      message={message}
      spotifyToken={spotifyToken}
      refreshToken={refreshToken}
      setMessage={setMessage}
    />
  ) : (
    <SpotifyRequest />
  );
}

export default CreatePlaylistHome;
