import { db } from "@/api/firebase";
import axios from "axios";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";

function PlaylistCreatorService() {
  const lastfm_key = process.env.NEXT_PUBLIC_LASTFM_API_KEY;
  const router = useRouter();

  // Fetches user data from Spotify using the provided token.
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
  
  //Uses lastfm api to find similar tracks, similar artists and similar albums to always generate a unique playlist.
  //Finds similar tracks, then similar artists and continues until it reaches 200 unique tracks.
  //If the limit has not been reached it starts looking for tracks based on similar albums. 
  async function getSimilarTracks(tracks) {
    try {
      const recommendedTracks = new Set();
      let queue = [...tracks];
      const processed = new Set();
  
      while (queue.length > 0 && recommendedTracks.size < 200) {
        const { artist, song } = queue.shift();
        const trackKey = `${artist.toLowerCase()} - ${song.toLowerCase()}`;
  
        if (processed.has(trackKey)) continue;
        processed.add(trackKey);
  
        let similarTracksUrl = `https://ws.audioscrobbler.com/2.0/?method=track.getSimilar&track=${encodeURIComponent(song)}&artist=${encodeURIComponent(artist)}&api_key=${lastfm_key}&format=json&autocorrect=1&limit=10`;
  
        console.log(`Fetching similar tracks for: ${artist} - ${song}`);
  
        try {
          const response = await axios.get(similarTracksUrl);
          let similarTracks = response.data.similartracks?.track || [];
  
          if (similarTracks.length === 0) {
            console.log(`No similar tracks found, fetching similar artists for: ${artist}`);
  
            const similarArtistsUrl = `https://ws.audioscrobbler.com/2.0/?method=artist.getSimilar&artist=${encodeURIComponent(artist)}&api_key=${lastfm_key}&format=json&limit=5`;
            const artistsResponse = await axios.get(similarArtistsUrl);
            const similarArtists = artistsResponse.data.similarartists?.artist || [];
  
            for (const similarArtist of similarArtists) {
              const artistName = similarArtist.name;
              const topTracksUrl = `https://ws.audioscrobbler.com/2.0/?method=artist.getTopTracks&artist=${encodeURIComponent(artistName)}&api_key=${lastfm_key}&format=json&limit=5`;
  
              try {
                const topTracksResponse = await axios.get(topTracksUrl);
                const topTracks = topTracksResponse.data.toptracks?.track || [];
  
                for (const topTrack of topTracks) {
                  if (topTrack.name && topTrack.artist?.name) {
                    const trackObj = { artist: topTrack.artist.name, song: topTrack.name };
                    const trackKey = `${trackObj.artist.toLowerCase()} - ${trackObj.song.toLowerCase()}`;
  
                    if (!processed.has(trackKey) && recommendedTracks.size < 200) {
                      recommendedTracks.add(JSON.stringify(trackObj));
                      queue.push(trackObj);
                    }
                  }
                }
              } catch (error) {
                console.error(`Error fetching top tracks for artist ${artistName}:`, error);
              }
            }
          }
  
          for (const track of similarTracks.slice(0, 10)) {
            if (track.name && track.artist?.name) {
              const trackObj = { artist: track.artist.name, song: track.name };
              const trackKey = `${trackObj.artist.toLowerCase()} - ${trackObj.song.toLowerCase()}`;
  
              if (!processed.has(trackKey) && recommendedTracks.size < 200) {
                recommendedTracks.add(JSON.stringify(trackObj));
                queue.push(trackObj);
              }
            }
          }
        } catch (error) {
          console.error(`Error fetching similar tracks for ${artist} - ${song}:`, error);
        }
      }
  
      // If 200 tracks haven't been reached yet, start looking for similar albums 
      if (recommendedTracks.size < 200) {
        console.log("Switching to album-based recommendations...");
        const tempTracks = Array.from(recommendedTracks).map(JSON.parse);
  
        for (const { artist, song } of tempTracks) {
          if (recommendedTracks.size >= 200) break;
  
          const albumsUrl = `https://ws.audioscrobbler.com/2.0/?method=album.search&album=${encodeURIComponent(song)}&api_key=${lastfm_key}&format=json&limit=5`;
  
          try {
            const albumsResponse = await axios.get(albumsUrl);
            const albums = albumsResponse.data.results.albummatches?.album || [];
  
            for (const album of albums) {
              console.log(`Fetching tracks from album: ${album.name} by ${album.artist}`);
  
              const albumTracksUrl = `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&artist=${encodeURIComponent(album.artist)}&album=${encodeURIComponent(album.name)}&api_key=${lastfm_key}&format=json`;
              try {
                const albumTracksResponse = await axios.get(albumTracksUrl);
                const albumTracks = albumTracksResponse.data.album?.tracks?.track || [];
  
                if (albumTracks.length > 0) {
                  // Shuffle album tracks and select two
                  const shuffledTracks = albumTracks.sort(() => 0.5 - Math.random()).slice(0, 2);
  
                  for (const albumTrack of shuffledTracks) {
                    if (albumTrack.name) {
                      const trackObj = { artist: album.artist, song: albumTrack.name };
                      const trackKey = `${trackObj.artist.toLowerCase()} - ${trackObj.song.toLowerCase()}`;
  
                      if (!processed.has(trackKey) && recommendedTracks.size < 200) {
                        console.log(`Adding track from album: ${trackObj.song} by ${trackObj.artist}`);
                        recommendedTracks.add(JSON.stringify(trackObj));
                      }
                    }
                  }
                }
              } catch (error) {
                console.error(`Error fetching album tracks for ${album.name} by ${album.artist}:`, error);
              }
            }
          } catch (error) {
            console.error(`Error fetching similar albums for ${song}:`, error);
          }
        }
      }
  
      let trackArray = Array.from(recommendedTracks).map(JSON.parse);
      console.log(`Collected ${trackArray.length} unique tracks.`);
      return trackArray;
    } catch (error) {
      console.error("Error fetching LastFM API key:", error);
      return [];
    }
  }
  
  
  //First searches all 200 tracks on spotify 
  //Chooses 50 random tracks from the array
  //Those tracks are added to the playlist
  async function searchTracks(tracks, spotifyToken) {
    console.log("Spotify Access Token:", spotifyToken);
  
    const foundTracks = [];
  
    for (const track of tracks) {
      const artist = track.artist.trim();
      const song = track.song.trim();
  
      console.log(`Searching for track: ${artist} - ${song}`);
  
      const queryStr = `artist:${encodeURIComponent(artist)} track:${encodeURIComponent(song)}`;
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
            console.log(`Found track ID: ${selectedTrack.id} for ${artist} - ${song}`);
            foundTracks.push(selectedTrack.id);
          }
        }
      } catch (error) {
        console.error(`Error searching for track ${artist} - ${song}:`, error.response?.data || error.message);
      }
    }
  
    if (foundTracks.length === 0) throw new Error("No Spotify tracks found.");
  
    // Shuffle the found tracks using Fisher-Yates algorithm
    for (let i = foundTracks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [foundTracks[i], foundTracks[j]] = [foundTracks[j], foundTracks[i]];
    }
  
    // Select exactly 50 unique tracks
    return foundTracks.slice(0, 50);
  }
  

async function uploadPlaylistImage(playlistId, spotifyToken, playListImage) {
  fetch(`https://api.spotify.com/v1/playlists/${playlistId}/images`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${spotifyToken}`,
      'Content-Type': 'image/jpeg',
    },
    body: playListImage,  
  })
    .then(response => {
      if (response.status === 202) {
        console.log("Playlist image uploaded successfully.");
      } else {
        console.error(`Error uploading playlist image: ${response.status}`);
      }
    })
    .catch(error => {
      console.error("Error uploading playlist image:", error);
    });
}

const sendtoPlaylist = (playlistId, spotifyToken) => {
  const playlistid = playlistId;
  const spotifytoken = spotifyToken;
  
  router.push(`/createPlayList/${playlistid}/${spotifytoken}`);
}

async function createPlaylist({
  selectedDateRange,
  selectedMood,
  spotifyToken,
  userProfileId,
  playListImage,
  playlistDescription,
}) {
  try {
    console.log("Spotify User ID:", userProfileId);
    console.log("Spotify Token:", spotifyToken);
    console.log("Playlist Image:", playListImage);

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

    await uploadPlaylistImage(playlistId, spotifyToken, playListImage);

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
    sendtoPlaylist(playlistId, spotifyToken); 


    return playlistId;

  } catch (error) {
    console.error("Error in createPlaylist:", error.response?.data || error.message);
    throw error;
  }
}




  return {
    fetchSpotifyUserProfile,
    getTimeRange,
    getTracks,
    searchTracks,
    getSimilarTracks,
    sendtoPlaylist,
    createPlaylist,
  };
}

export default PlaylistCreatorService;
