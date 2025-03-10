'use client';

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { motion } from 'framer-motion';
import { useEffect, useState } from "react";
import SpotifyAuth from "./spotify-auth";
import SpotifyRequest from "./spotify-request";


function CreatePlaylistHome() {
  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
  const [spotifyToken, setSpotifyToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [expiresIn, setExpiresIn] = useState(null); 
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
      //use http://localhost:8080/ in local
      const response = await fetch('api/refresh_token', {
        method: 'GET',
        headers: { Authorization: `Bearer ${idToken}` },
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        setSpotifyToken(data.access_token);
        setRefreshToken(data.refresh_token);
        setExpiresIn(data.expires_in); 
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
      refreshSpotifyToken(); 
    }, (expiresIn - 60) * 1000); 

    setRefreshTimeout(timeout);

    return () => clearTimeout(timeout); // Cleanup on unmount
  }, [expiresIn]); // Only depend on expiresIn

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const idToken = await currentUser.getIdToken();
          //use http://localhost:8080/ in local
          const response = await fetch("/api/home", {
            method: "GET",
            headers: { Authorization: `Bearer ${idToken}` },
            credentials: "include",
          });

          const data = await response.json();
          if (response.ok) {
            setSpotifyAuthenticated(true);
            setSpotifyToken(data.spotifyAccessToken);
            setRefreshToken(data.spotifyRefreshToken);
            setExpiresIn(data.expiresIn); 
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}  
    >
      {spotifyAuthenticated ? (
        <SpotifyAuth 
          spotifyToken={spotifyToken} 
          refreshToken={refreshToken} 
          refreshSpotifyToken={refreshSpotifyToken}  
        />
      ) : (
        <SpotifyRequest />
      )}
    </motion.div>
  )
}

export default CreatePlaylistHome;
