'use client';

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import SpotifyAuth from './spotify-auth';
import SpotifyRequest from './spotify-request';

function CreatePlaylistHome() {
    const [message, setMessage] = useState("Loading");
    const [user, setUser] = useState(null);
    const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
    const [spotifyToken, setSpotifyToken] = useState(null);

    const checkSpotifyAuth = async (idToken) => {
        try {
            const response = await fetch("http://localhost:8080/api/home", {
                method: 'GET',
                credentials: "include",
                headers: {
                    "Authorization": `Bearer ${idToken}`,
                    "Content-Type": "application/json"
                }
            });
    
            const data = await response.json();
            console.log("Server Response:", data);
    
            if (data.error === "Spotify not authenticated") {
                setSpotifyAuthenticated(false);
            } else {
                setSpotifyAuthenticated(true);
                setSpotifyToken(data.spotifyAccessToken);
                setMessage(data.message);
            }
        } catch (error) {
            console.error("Error checking Spotify authentication:", error);
            setMessage("Error communicating with server.");
        }
    };
    
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                const idToken = await currentUser.getIdToken();
                await checkSpotifyAuth(idToken);
            } else {
                setMessage("User not authenticated");
            }
        });

        return () => unsubscribe();
    }, []);

    if (user && !spotifyAuthenticated) {
        return <SpotifyRequest />;
    }

    if (user && spotifyAuthenticated) {
        return <SpotifyAuth message={message} token={spotifyToken} />;
    }

    return <div>{message}</div>;
}

export default CreatePlaylistHome;
