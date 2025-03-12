import axios from 'axios';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import SpotifyIcon from '../../../public/icons/SpotifyIcon.svg';
import styles from '../styles/createplaylist.module.css';
const ViewPlaylist = ({ playlistId, spotifyToken, setPlaylistId }) => {
  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [playlistImage, setPlaylistImage] = useState("");


  useEffect(() => {
    if (!playlistId || !spotifyToken) {
      console.warn("Missing playlist ID or Spotify token.");
      return;
    }

    console.log('Fetching playlist data for playlistId:', playlistId);


    const fetchPlaylistData = async () => {
      try {
        const playlistUrl = `https://api.spotify.com/v1/playlists/${playlistId}`;
        console.log('Fetching playlist details from Spotify API...');
        const playlistResponse = await axios.get(playlistUrl, {
          headers: {
            Authorization: `Bearer ${spotifyToken}`,
            'Content-Type': 'application/json',
          },
        });

        console.log(playlistResponse.data); 
        setPlaylist(playlistResponse.data);
        setPlaylistImage(playlistResponse.data.images?.[0]?.url || '');

        const tracksUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=5`;
        console.log('Fetching playlist tracks from Spotify API...');
        const tracksResponse = await axios.get(tracksUrl, {
          headers: {
            Authorization: `Bearer ${spotifyToken}`,
            'Content-Type': 'application/json',
          },
        });

        setTracks(tracksResponse.data.items || []);
      } catch (error) {
        console.error('Error fetching playlist data:', error);
      }
    };

    fetchPlaylistData();
  }, [playlistId, spotifyToken]);

  if (!playlist) return <div>Loading...</div>;

  const handlecreatePlayList = () => {
    setPlaylistId(null);  
  };

  return (
    <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}  
    className={styles.app}
  >
      <div className={styles.pagecontentContainer}>
        <div className={styles.titleContainer}>
          <div className={styles.playlistMessageContainer}>
            <h1 className={styles.playlistMessage}>
              Playlist Successfully Created !
            </h1>
          </div>
        </div>
        <div className={styles.playlistContainer}>
          <div className={styles.playlistContent}>
            <div className={styles.playlistImageContainer}>
              {playlistImage && (
                <img
                  src={playlistImage}
                  alt={`Playlist cover of ${playlist.name}`}
                  style={{ width: '500px', height: '500px', borderRadius: '50px' }}   
                  className={styles.playlistImage}
                />
              )}
            </div>
            <div className={styles.playlistLinkContainer}>
              <button 
                onClick={() => window.open(playlist.external_urls.spotify, '_blank', 'noopener,noreferrer')}  
                className={styles.playlistButton}
              >
                <Image 
                  src={SpotifyIcon} 
                  className={styles.icon} 
                  alt="Spotify Icon" 
                />
                View Playlist on Spotify          
              </button>

              <button 
                onClick={handlecreatePlayList}  
                className={styles.playlistButton}
              >
                Create Another Playlist
              </button>
            </div>
          </div>

          <div className={styles.playlistContent2}>
            <div className={styles.headingsContainer}>
              <h1 className={styles.playlistTitle}>{playlist.name}</h1>
            </div>
            <div className={styles.playlistDescription}>
              <p>{playlist.description || 'No description available.'}</p>
            </div>
            <div className={styles.playlistTracks}>
              {tracks.length === 0 ? (
                <p>No tracks available.</p>
              ) : (
                tracks.map((trackItem, index) => (
                  <li key={index} className={styles.trackItem}>
                    <div className={styles.trackInfo}>              
                      <img
                        src={trackItem.track.album.images?.[0]?.url || '/default-placeholder.png'}
                        alt={`Album cover of ${trackItem.track.album.name}`}
                        style={{ width: '100px', height: '100px', borderRadius: '30px' }}   
                      />
                      <div className={styles.trackDescription}>
                        <div className={styles.trackTitle}>
                          {trackItem.track.name} 
                        </div>
                        <div className={styles.trackArtist}>
                          {trackItem.track.artists.map((artist) => artist.name).join(', ')}
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
  </motion.div>

  );
};

export default ViewPlaylist;
