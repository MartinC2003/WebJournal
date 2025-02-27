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

    //fetches user data using spotifytoken 
    //goes to the /api/home endpoint 
    const fetchSpotifyUserProfile = async (spotifyToken) => {
        try {
            const response = await fetch("https://api.spotify.com/v1/me", {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${spotifyToken}`,
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


    const refreshSpotifyToken = async () => {
        try {
            const response = await fetch("http://localhost:8080/refresh_token", { method: "GET" });
            if (!response.ok) throw new Error("Failed to refresh token");
    
            const data = await response.json();
    
            if (data.access_token) {
                return new Promise((resolve) => {
                    resolve(data.access_token);
                    setSpotifyToken(data.access_token); // Update access token state
                    if (data.refresh_token) {
                        setSpotifyRefreshToken(data.refresh_token); // Update refresh token state
                    }
                });
            } else {
                console.error("No access token received.");
                return null;
            }
        } catch (error) {
            console.error("Error refreshing Spotify token:", error);
            return null;
        }
    };
    
    const getEntries = async (month, year) => {
        const { startDate, endDate } = getMonthRange(month, year);
        const entriesRef = collection(db, "DairyEntries");
        const q = query(entriesRef, where("date", ">=", startDate), where("date", "<=", endDate));
        
        try {
            const querySnapshot = await getDocs(q);
            let entries = [];
            querySnapshot.forEach((doc) => {
                entries.push({ id: doc.id, ...doc.data() });
            });
            console.log("Entries found:", entries);
            return entries;
        } catch (error) {
            console.error("Error fetching entries:", error);
            return [];
        }
    };


    const getTracks = async (month, year, mood) => {
        const entries = await getEntries(month, year);
        let tracks = [];


        for (const entry of entries) {
            if (entry.mood === mood) {
                const tracksRef = collection(db, "DairyEntries", entry.id, "tracks");
                const trackDocs = await getDocs(tracksRef);
                trackDocs.forEach((trackDoc) => {
                    tracks.push(trackDoc.data());
                });
            }
        }


        if (tracks.length > 10) {
            tracks = tracks.sort(() => Math.random() - 0.5).slice(0, 10);
        }
        
        if (tracks.length === 0) {
            console.error("No tracks found for the selected mood.");
            return null;
        }
        
        console.log("Selected tracks:", tracks);
        return tracks;
    };

    

    return { fetchSpotifyUserProfile, refreshSpotifyToken };
}

export default PlaylistCreatorService;
