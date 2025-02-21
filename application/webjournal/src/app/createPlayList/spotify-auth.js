import Image from "next/image";
import { useEffect, useState } from "react";
import styles from '../styles/createplaylist.module.css';

function SpotifyAuth({ message, token }) {
    const [userProfile, setUserProfile] = useState(null);

    const fetchSpotifyUserProfile = async (token) => {
        try {
            const response = await fetch("https://api.spotify.com/v1/me", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`Spotify API error: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching Spotify user profile:", error);
            return null;
        }
    };

    useEffect(() => {
        if (token) {
            fetchSpotifyUserProfile(token).then(data => {
                if (data) setUserProfile(data);
            });
        }
    }, [token]);

    return (
        <div className={styles.app}>
            <div className={styles.pagecontentContainer}>
                <div className={styles.titleContainer}>
                    <Image
                        src="/createplaylist/playlistcreator-title.png"
                        className={styles.titleImage}
                        width={1129}
                        height={211}
                        alt="Playlist creator title"
                    />
                </div>
                <p>{message}</p>

                {userProfile && (
                    <div>
                        <h3>Welcome, {userProfile.display_name}!</h3>
                        <img src={userProfile.images[0]?.url} alt="Spotify Profile" width={100} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default SpotifyAuth;
