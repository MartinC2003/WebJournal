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
    
    return { fetchSpotifyUserProfile };
}

export default PlaylistCreatorService;