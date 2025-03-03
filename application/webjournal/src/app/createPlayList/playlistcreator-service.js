import { db } from "@/api/firebase";
import axios from "axios";
import { collection, getDocs, query, where } from "firebase/firestore";

function PlaylistCreatorService() {
  // Fetches user data from Spotify using the provided token.
  const lastfm_key = process.env.NEXT_PUBLIC_LASTFM_API_KEY;


  const fetchSpotifyUserProfile = async (spotifyToken) => {
    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${spotifyToken}`,
          "Content-Type": "application/json",
        },
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

  // Refreshes the Spotify token.
  // (This still calls your refresh token endpoint at localhost:8080;
  // you can modify this if you want a different mechanism.)
  const refreshSpotifyToken = async () => {
    try {
      const response = await fetch("http://localhost:8080/refresh_token", {
        method: "GET",
      });
      if (!response.ok) throw new Error("Failed to refresh token");

      const data = await response.json();
      if (data.access_token) {
        return data; // { access_token, refresh_token? }
      } else {
        console.error("No access token received.");
        return null;
      }
    } catch (error) {
      console.error("Error refreshing Spotify token:", error);
      return null;
    }
  };

  // Converts a month (string) and year into a start and end date (YYYY-MM-DD).
  //Works 
  function getTimeRange(month, year) {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    console.log("Input month:", month);
    const monthIndex = monthNames.indexOf(month);
    console.log("Computed month index:", monthIndex);
    if (monthIndex === -1) {
      throw new Error("Invalid month provided");
    }
    const startDate = new Date(year, monthIndex, 1);
    const endDate = new Date(year, monthIndex + 1, 0);
    console.log("Start date:", startDate.toISOString().slice(0, 10));
    console.log("End date:", endDate.toISOString().slice(0, 10));
    return {
      startDate: startDate.toISOString().slice(0, 10),
      endDate: endDate.toISOString().slice(0, 10),
    };
  }
  
  // Retrieves diary entries from Firestore within the given time range and mood,
  // then extracts the track information (artist and song).
  //Works 
  async function getTracks(month, year, mood) {
    const { startDate, endDate } = getTimeRange(month, year);
    console.log("getTracks: Querying entries between", startDate, "and", endDate, "with mood:", mood);
    
    const diaryEntries = [];
    try {
      const diaryQuery = query(
        collection(db, "DairyEntries"),  
        where("date", ">=", startDate),
        where("date", "<=", endDate),
        where("mood", "==", mood)
      );
      const querySnapshot = await getDocs(diaryQuery);
      console.log("Query snapshot size:", querySnapshot.size);
      querySnapshot.forEach((doc) => {
        console.log("Document ID:", doc.id, "Data:", doc.data());
        diaryEntries.push(doc.data());
      });
    } catch (error) {
      console.error("Error querying diary entries:", error);
      throw new Error("Failed to retrieve diary entries.");
    }
  
    let tracks = [];
    diaryEntries.forEach((entry) => {
      if (entry.tracks && entry.tracks.length > 0) {
        console.log("Entry tracks found:", entry.tracks);
        entry.tracks.forEach((track) => {
          console.log("Using trackTitle:", track.trackTitle);
          tracks.push({
            artist: track.artist,
            song: track.trackTitle,   
          });
        });
      } else {
        console.log("No tracks found in entry:", entry);
      }
    });
  
    console.log("Final tracks array:", tracks);
    if (tracks.length === 0) {
      throw new Error("No tracks found for the given month and mood.");
    }
    return tracks;
  }
  
  async function getSimilarTracks(tracks) {
    try {
      const recommendedTrackIds = new Set();
      let queue = [...tracks];
      const processed = new Set();
  
      while (queue.length > 0 && recommendedTrackIds.size < 75) {
        const { artist, song } = queue.shift();
  
        if (processed.has(`${artist} - ${song}`)) continue;
        processed.add(`${artist} - ${song}`);
  
        // Construct the LastFM URL for similar tracks
        const similarTracksUrl = `http://ws.audioscrobbler.com/2.0/?method=track.getSimilar&track=${encodeURIComponent(song)}&artist=${encodeURIComponent(artist)}&api_key=${lastfm_key}&format=json&autocorrect=1&limit=10`;
  
        console.log(`Sending request for: ${similarTracksUrl}`);
  
        try {
          const response = await axios.get(similarTracksUrl);
          const similarTracks = response.data.similartracks?.track || [];
  
          if (similarTracks.length === 0) {
            console.log(`No similar tracks found for ${artist} - ${song}, fetching similar artists...`);
            
            // If no similar tracks found, fetch similar artists
            const similarArtistsUrl = `http://ws.audioscrobbler.com/2.0/?method=artist.getSimilar&artist=${encodeURIComponent(artist)}&api_key=${lastfm_key}&format=json&autocorrect=1&limit=5`;
  
            const artistsResponse = await axios.get(similarArtistsUrl);
            const similarArtists = artistsResponse.data.similarartists?.artist || [];
  
            for (const similarArtist of similarArtists) {
              const artistName = similarArtist.name;
  
              // Fetch top tracks for each similar artist
              const topTracksUrl = `http://ws.audioscrobbler.com/2.0/?method=artist.getTopTracks&artist=${encodeURIComponent(artistName)}&api_key=${lastfm_key}&format=json&limit=5`;
              try {
                const topTracksResponse = await axios.get(topTracksUrl);
                const topTracks = topTracksResponse.data.toptracks?.track || [];
  
                topTracks.forEach((topTrack) => {
                  if (topTrack.name && topTrack.artist?.name && !processed.has(`${topTrack.artist.name} - ${topTrack.name}`)) {
                    recommendedTrackIds.add({ artist: topTrack.artist.name, song: topTrack.name });
                    queue.push({ artist: topTrack.artist.name, song: topTrack.name });
                  }
                });
              } catch (error) {
                console.error(`Error fetching top tracks for similar artist ${artistName}:`, error);
              }
            }
          }
  
          // Process similar tracks if available
          similarTracks.slice(0, 10).forEach(({ name, artist }) => {
            if (name && artist?.name && !processed.has(`${artist.name} - ${name}`)) {
              recommendedTrackIds.add({ artist: artist.name, song: name });
              queue.push({ artist: artist.name, song: name });
            }
          });
        } catch (error) {
          console.error(`Error fetching similar tracks for ${artist} - ${song}:`, error);
        }
      }
  
      return Array.from(recommendedTrackIds).slice(0, 75);
    } catch (error) {
      console.error("Error fetching LastFM API key:", error);
    }
  }
  
// For each track from the diary, search Spotify’s API to extract a track ID.
async function searchTracks(tracks, spotifyToken) {
  console.log("Spotify Access Token:", spotifyToken);
  const spotifyTrackIds = [];

  // Loop through all tracks (diary tracks + Last.fm recommended tracks)
  for (const track of tracks) {
    const artist = track.artist.trim();
    const song = track.song.trim();

    console.log(`Searching for track: ${artist} - ${song}`);

    // Fix query encoding (leave `artist:` and `track:` unencoded)
    const queryStr = `artist:${encodeURIComponent(artist)} track:${encodeURIComponent(song)}`;

    // Add market and pagination
    const url = `https://api.spotify.com/v1/search?q=${queryStr}&type=track&market=from_token&limit=20&offset=0`;

    try {
      const response = await axios.get(url, {
        headers: { 
          Authorization: `Bearer ${spotifyToken}`, 
          "Content-Type": "application/json",
        },
      });

      const data = response.data;
      if (data.tracks && data.tracks.items.length > 0) {
        let selectedTrack = data.tracks.items[0];
        if (selectedTrack?.id) {
          console.log(`Found track id: ${selectedTrack.id} for ${artist} - ${song}`);
          spotifyTrackIds.push(selectedTrack.id);
        }
      }
    } catch (error) {
      console.error(`Error searching for track ${artist} - ${song}:`, error.response?.data || error.message);
    }
  }

  if (spotifyTrackIds.length === 0) throw new Error("No Spotify tracks found.");

  return spotifyTrackIds;
}

async function createPlaylist({
  selectedDateRange,
  selectedMood,
  spotifyToken,
  userProfileId,
  playlistImage,
  playlistDescription,
}) {
  try {
    console.log("Spotify User ID:", userProfileId);
    console.log("Spotify Token:", spotifyToken);

    // Retrieve diary tracks from Firestore
    const diaryTracks = await getTracks(selectedDateRange.month, selectedDateRange.year, selectedMood);
    console.log("Diary tracks retrieved:", diaryTracks);

    // Get similar tracks from Last.fm
    const similarTracksFromLastFM = await getSimilarTracks(diaryTracks);
    console.log("Similar tracks from Last.fm:", similarTracksFromLastFM);

    // Combine the original diary tracks with the similar tracks from Last.fm
    const allTracks = [...diaryTracks, ...similarTracksFromLastFM];
    console.log("All combined tracks:", allTracks);

    // Search Spotify for track IDs
    const trackIds = await searchTracks(allTracks, spotifyToken);
    console.log("Spotify track IDs:", trackIds);

    // Create playlist payload
    const playlistPayload = {
      name: selectedMood,
      description: playlistDescription,
      public: false,
    };

    console.log("Creating playlist with payload:", JSON.stringify(playlistPayload, null, 2));

    // Create playlist on Spotify
    const createPlaylistUrl = `https://api.spotify.com/v1/users/${userProfileId}/playlists`;
    const createPlaylistResponse = await axios.post(createPlaylistUrl, playlistPayload, {
      headers: {
        Authorization: `Bearer ${spotifyToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Create Playlist Response:", createPlaylistResponse.data);

    const playlistData = createPlaylistResponse.data;
    const playlistId = playlistData.id;
    console.log(`Created playlist with ID: ${playlistId}`);

    // Upload playlist image (if provided)
    if (playlistImage) {
      const uploadImageUrl = `https://api.spotify.com/v1/playlists/${playlistId}/images`;
      try {
        await axios.put(uploadImageUrl, playlistImage, {
          headers: {
            Authorization: `Bearer ${spotifyToken}`,
            "Content-Type": "image/jpeg",
          },
        });
      } catch (error) {
        console.error("Error uploading playlist image:", error);
      }
    }

    // Add tracks to the playlist
    const addTracksUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
    const addTracksPayload = {
      uris: trackIds.map((id) => `spotify:track:${id}`),
    };

    console.log("Adding tracks with payload:", JSON.stringify(addTracksPayload, null, 2));

    await axios.post(addTracksUrl, addTracksPayload, {
      headers: {
        Authorization: `Bearer ${spotifyToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Tracks added to playlist successfully.");
    return playlistId;
  } catch (error) {
    console.error("Error in createPlaylist:", error.response?.data || error.message);
    throw error;
  }
}



  return {
    fetchSpotifyUserProfile,
    refreshSpotifyToken,
    getTimeRange,
    getTracks,
    searchTracks,
    getSimilarTracks,
    createPlaylist,
  };
}

export default PlaylistCreatorService;
