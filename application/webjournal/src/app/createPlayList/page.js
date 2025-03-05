"use client";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import SpotifyAuth from "./spotify-auth";
import SpotifyRequest from "./spotify-request";

function CreatePlaylistHome() {
  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
  const [spotifyToken, setSpotifyToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [refreshTimeout, setRefreshTimeout] = useState(null); // Store timeout reference

  // Function to refresh Spotify token
  const refreshSpotifyToken = async () => {
    try {
      const response = await fetch("http://localhost:8080/refresh_token", {
        method: "GET",
      });
      if (!response.ok) throw new Error("Failed to refresh token");

      const data = await response.json();
      if (data.access_token) {
        return data;
      } else {
        console.error("No access token received.");
        return null;
      }
    } catch (error) {
      console.error("Error refreshing Spotify token:", error);
      return null;
    }
  };

  // Function to schedule token refresh
  const scheduleTokenRefresh = (expiresIn) => {
    if (refreshTimeout) clearTimeout(refreshTimeout); // Clear existing timeout

    const timeout = setTimeout(async () => {
      const newTokenData = await refreshSpotifyToken();
      if (newTokenData) {
        setSpotifyToken(newTokenData.access_token);
        scheduleTokenRefresh(newTokenData.expires_in); // Schedule next refresh
      }
    }, (expiresIn - 60) * 1000); // Refresh 60 seconds before expiration

    setRefreshTimeout(timeout);
  };

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
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
            console.log("Expires In:", data.expiresIn);

            // Schedule token refresh
            scheduleTokenRefresh(data.expiresIn);
          } else {
            setSpotifyAuthenticated(false);
          }
        } catch (error) {
          console.error("Error checking authentication:", error);
        }
      } else {
        setSpotifyAuthenticated(false);
      }
    });

    return () => {
      unsubscribe();
      if (refreshTimeout) clearTimeout(refreshTimeout); // Cleanup timeout
    };
  }, []);

  return spotifyAuthenticated ? (
  <SpotifyAuth 
    spotifyToken={spotifyToken} 
    refreshToken={refreshToken} 
    setSpotifyAuthenticated={setSpotifyAuthenticated}  // Pass the setter function here
  />
  ) : (
    <SpotifyRequest />
  );
}

export default CreatePlaylistHome;
