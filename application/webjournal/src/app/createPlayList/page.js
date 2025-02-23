'use client';

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import PlaylistCreatorService from './playlistcreator-service';
import SpotifyAuth from './spotify-auth';
import SpotifyRequest from './spotify-request';

function CreatePlaylistHome() {
    const { checkSpotifyAuth, refreshSpotifyToken } = PlaylistCreatorService();   
    const [message, setMessage] = useState("Loading");
    const [user, setUser] = useState(null);
    const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
    const [spotifyToken, setSpotifyToken] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                const idToken = await currentUser.getIdToken();
                // Check Spotify authentication status and handle token refresh
                await checkSpotifyAuth(idToken, setSpotifyAuthenticated, setSpotifyToken, setMessage);

                // Check if the token is expired, then refresh it
                if (!spotifyAuthenticated) {
                    console.log("Spotify not authenticated or token expired, refreshing...");
                    await refreshSpotifyToken(idToken, setSpotifyToken, setSpotifyAuthenticated, setMessage);
                }
            } else {
                setMessage("User not authenticated");
            }
        });

        return () => unsubscribe();
    }, [spotifyAuthenticated]);  // Add `spotifyAuthenticated` to dependency array

    // Conditionally render based on authentication status
    if (user && !spotifyAuthenticated) {
        return <SpotifyRequest />;
    }

    if (user && spotifyAuthenticated) {
        return <SpotifyAuth message={message} token={spotifyToken} />;
    }

    return <div>{message}</div>;
}

export default CreatePlaylistHome;
