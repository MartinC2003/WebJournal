'use client';
import axios from 'axios';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from '../../styles/createplaylist.module.css';

const ViewPlaylist = () => {
  const { playlistid } = useParams(); 
  const [spotifytoken, setSpotifyToken] = useState(null); 
  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    if (!spotifytoken) {
      console.log('No token found, attempting to fetch Spotify token...');
      getSpotifyToken();
    } else {
      console.log('Spotify token already available:', spotifytoken);
    }
  }, [spotifytoken]);

  const getSpotifyToken = async () => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        console.log('User authenticated:', currentUser.email);  
        try {
          const idToken = await currentUser.getIdToken();
          console.log('Fetched Firebase ID token:', idToken);

          const response = await fetch('http://localhost:8080/refresh_token', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
            credentials: 'include',
          });

          console.log('Response Status:', response.status);
          const data = await response.json();
          console.log('Response Data:', data);

          if (response.ok) {
            console.log('Spotify access token received:', data.access_token);
            setSpotifyToken(data.access_token); 
          } else {
            console.error('Failed to retrieve Spotify token:', data);
          }
        } catch (error) {
          console.error('Error refreshing Spotify token:', error);
        }
      } else {
        console.log('User not authenticated');
      }
    });

    return () => unsubscribe();
  };

  useEffect(() => {
    if (playlistid && spotifytoken) {
      console.log('Fetching playlist data for playlistId:', playlistid);

      const fetchPlaylistData = async () => {
        try {

          const url = `https://api.spotify.com/v1/playlists/${playlistid}`;
          console.log('Fetching playlist details from Spotify API...');
          const playlistResponse = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${spotifytoken}`,
              'Content-Type': 'application/json',
            },
          });
          console.log('Playlist data fetched:', playlistResponse.data);
          setPlaylist(playlistResponse.data);

          const url2 = `https://api.spotify.com/v1/playlists/${playlistid}/tracks`;
          console.log('Fetching playlist tracks from Spotify API...');
          const tracksResponse = await axios.get(url2, {
            headers: {
              Authorization: `Bearer ${spotifytoken}`,
              'Content-Type': 'application/json',
            },
          });
          console.log('Tracks data fetched:', tracksResponse.data);
          setTracks(tracksResponse.data.items);
        } catch (error) {
          console.error('Error fetching playlist data:', error);
        }
      };

      fetchPlaylistData();
    }
  }, [playlistid, spotifytoken]);

  if (!playlist) return <div>Loading...</div>;

  return (
    <div className={styles.app}>
      <h1>{playlist.name}</h1>
      <p>{playlist.description}</p>

      <a
        href={playlist.external_urls.spotify}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.playlistLink}
      >
        Open this playlist on Spotify
      </a>

      <ul>
        {tracks.map((trackItem, index) => (
          <li key={index} className={styles.trackItem}>
            <div className={styles.trackInfo}>
              <img
                src={trackItem.track.album.images[0].url}
                alt={`Album cover of ${trackItem.track.album.name}`}
                className={styles.albumCover}
              />
              <p>
                {trackItem.track.name} by{' '}
                {trackItem.track.artists.map((artist) => artist.name).join(', ')}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewPlaylist;
