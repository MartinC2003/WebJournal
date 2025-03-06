'use client';

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import SpotifyAuth from "./spotify-auth";
import SpotifyRequest from "./spotify-request";

function CreatePlaylistHome() {
  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
  const [spotifyToken, setSpotifyToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [expiresIn, setExpiresIn] = useState(null); // Track expiresIn separately
  const [refreshTimeout, setRefreshTimeout] = useState(null); 

  // Refresh Spotify Token
  const refreshSpotifyToken = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      console.log("User not authenticated.");
      return;
    }

    try {
      const idToken = await currentUser.getIdToken();
      const response = await fetch('http://localhost:8080/refresh_token', {
        method: 'GET',
        headers: { Authorization: `Bearer ${idToken}` },
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        setSpotifyToken(data.access_token);
        setRefreshToken(data.refresh_token);
        setExpiresIn(data.expires_in); // Update expiresIn separately
      } else {
        console.error('Failed to retrieve Spotify token:', data);
      }
    } catch (error) {
      console.error('Error refreshing Spotify token:', error);
    }
  };

  // Schedule Token Refresh
  useEffect(() => {
    if (!expiresIn) return;

    if (refreshTimeout) clearTimeout(refreshTimeout); 

    const timeout = setTimeout(() => {
      console.log("Token expired, refreshing...");
      refreshSpotifyToken(); // Trigger refresh when the token expires
    }, (expiresIn - 60) * 1000); // Refresh 60 seconds before expiration

    setRefreshTimeout(timeout);

    return () => clearTimeout(timeout); // Cleanup on unmount
  }, [expiresIn]); // Only depend on expiresIn

  // Authentication Check
  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const idToken = await currentUser.getIdToken();
          const response = await fetch("http://localhost:8080/api/home", {
            method: "GET",
            headers: { Authorization: `Bearer ${idToken}` },
            credentials: "include",
          });

          const data = await response.json();
          if (response.ok) {
            setSpotifyAuthenticated(true);
            setSpotifyToken(data.spotifyAccessToken);
            setRefreshToken(data.spotifyRefreshToken);
            setExpiresIn(data.expiresIn); // Store expiresIn separately
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

    return () => unsubscribe();
  }, []);

  return spotifyAuthenticated ? (
    <SpotifyAuth 
      spotifyToken={spotifyToken} 
      refreshToken={refreshToken} 
      refreshSpotifyToken={refreshSpotifyToken}  
    />
  ) : (
    <SpotifyRequest />
  );
}

export default CreatePlaylistHome;
