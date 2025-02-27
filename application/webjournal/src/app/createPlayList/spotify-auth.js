import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "../styles/createplaylist.module.css";
import PlaylistCreatorService from "./playlistcreator-service";

function SpotifyAuth({ token }) {
    const [userProfile, setUserProfile] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const { fetchSpotifyUserProfile, refreshSpotifyToken, createPlaylist } = PlaylistCreatorService(token);
    const [mood, setMood] = useState("Happy");  
    const [month, setMonth] = useState("January"); 
    const [year, setYear] = useState(new Date().getFullYear()); 
    const [moodMessage, setMoodMessage] = useState(""); 

    const moodDescriptions = {
        "Happy": "An uplifting playlist full of positive energy, perfect for celebrating or enjoying a sunny day.",
        "Sad": "A comforting playlist for when you're feeling down, offering solace and a space to process your emotions.",
        "Angry": "A high-energy playlist to help channel frustration and power through chaos.",
        "Scared": "A chilling playlist full of eerie melodies that create a suspenseful and mysterious atmosphere.",
        "Disgusted": "A rebellious playlist with gritty, unconventional tracks that break away from the norm."
    };

    const moodImages = {
        "Happy": "/createplaylist/happy-albumcv-plc.png",
        "Sad": "/createplaylist/sad-albumcv-plc.png",
        "Angry": "/createplaylist/angry-albumcv-plc.png",
        "Scared": "/createplaylist/scared-albumcv-plc.png",
        "Disgusted": "/createplaylist/disgusted-albumcv-plc.png"
    };

    //fetches user data from Spotify 
    useEffect(() => {
        if (token) {
            fetchSpotifyUserProfile(token)
                .then((data) => {
                    console.log("Fetched Spotify Profile:", data);
                    setUserProfile(data);
                })
                .catch((error) => {
                    console.error("Error fetching Spotify profile:", error);
                });
        }
    }, [token]);
    

    useEffect(() => {
        setMoodMessage(moodDescriptions[mood]);
    }, [mood]);

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
                <div className={styles.flexContainer}>
                    <div className={styles.imageContainer}>
                        <Image
                            src="/createplaylist/createplaylist-desc-plc.png"  
                            className={styles.titleImage}
                            width={1129}
                            height={211}
                            alt="Main album cover"
                        />
                    </div>
                    <div className={styles.descContainer}>
                        <div className={styles.headingsContainer}>
                            <h1 className={styles.headings}>How it works</h1>
                        </div>

                        <div className={styles.desc}>
                            {userProfile ? (
                                <>Hello {userProfile.display_name}! Welcome to the Musicjournal Playlist Creator!</>
                            ) : (
                                "Error, Spotify token expired"
                            )}
                            <div className={styles.desc2}>
                                Musicjournal enhances your journaling experience by creating personalized playlists based on 
                                what tracks you listed in your entries. To begin, select a month in range to create a playlist from the
                                entries made in that month. Then select a mood to generate off of. Make sure an entry with that selected mood
                                exists or else the generator will fail. 
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.flexContainer2}>
                    <div className={styles.moodImageContainer}>
                        <Image
                            src={moodImages[mood]} 
                            className={styles.moodImage}
                            width={600}
                            height={600}
                            alt={`${mood} mood cover`}
                        />
                    </div>
                    <div className={styles.chooseMoodContainer}>
                        <h1 className={styles.chooseMoodTitle}>{mood}</h1>
                        <p className={styles.moodMessage}>{moodMessage}</p>
                        <h1 className={styles.selectTitle}>Selected Mood</h1>
                        <div className={styles.selectContainer}>
                            <select
                                className={styles.selectInput}
                                value={mood}
                                onChange={(e) => setMood(e.target.value)}
                            >
                                {Object.keys(moodDescriptions).map((moodOption) => (
                                    <option key={moodOption} value={moodOption}>
                                        {moodOption}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <h1 className={styles.selectTitle}>Date in range</h1>
                        <div className={styles.selectContainer2}>
                            <select
                                className={styles.selectInput}
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                            >
                                {[ "January", "February", "March", "April", "May", "June",
                                   "July", "August", "September", "October", "November", "December"
                                ].map((monthOption) => (
                                    <option key={monthOption} value={monthOption}>
                                        {monthOption}
                                    </option>
                                ))}
                            </select>
                            <select
                                className={styles.selectInput}
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                            >
                                {Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - i).map((yearOption) => (
                                    <option key={yearOption} value={yearOption}>
                                        {yearOption}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SpotifyAuth;
