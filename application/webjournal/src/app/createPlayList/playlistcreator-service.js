//Get month in range
//Get selected mood
//Create array 
//Search Dairy Entries collection for entries of the same mood 
//Get tracks from those entries 
//Put tracks in array 
//send request to spotify to search for those tracks and get a playlist out of them 
//spotify makes playlist and sends it back to client
//client displays link to playlist 

function PlaylistCreatorService() {
    const fetchSpotifyUserProfile = async (token) => {
        try {
            const response = await fetch("https://api.spotify.com/v1/me", {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) {
                throw new Error("Failed to fetch Spotify profile");
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching Spotify profile:", error);
            return null;
        }
    };

    const refreshSpotifyToken = async (idToken, setSpotifyToken, setSpotifyAuthenticated, setMessage) => {
        try {
            const response = await fetch("http://localhost:8080/refresh_token", {
                method: 'GET',
                credentials: "include",
                headers: {
                    "Authorization": `Bearer ${idToken}`,
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json();
            if (data.access_token) {
                console.log("Spotify token refreshed:", data.access_token);
                setSpotifyToken(data.access_token);
                setSpotifyAuthenticated(true);
                setMessage("Spotify session refreshed.");
            } else {
                setSpotifyAuthenticated(false);
                setMessage("Failed to refresh Spotify session.");
            }
        } catch (error) {
            console.error("Error refreshing Spotify token:", error);
            setMessage("Error refreshing Spotify session.");
        }
    };

    const checkSpotifyAuth = async (idToken, setSpotifyAuthenticated, setSpotifyToken, setMessage) => {
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
            } else if (data.error === "Token expired") {
                console.log("Spotify token expired. Refreshing...");
                await refreshSpotifyToken(idToken, setSpotifyToken, setSpotifyAuthenticated, setMessage);
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


    return { fetchSpotifyUserProfile, checkSpotifyAuth, refreshSpotifyToken, };
}

export default PlaylistCreatorService;
