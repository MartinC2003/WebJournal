import Image from "next/image";
import { useRouter } from "next/navigation";
import SpotifyIcon from '../../../public/icons/SpotifyIcon.svg';
import styles from '../styles/createplaylist.module.css';
function SpotifyRequest() {
    const router = useRouter();

    const handleSpotifySignin = async () => {
        try {
            //http://localhost:8080/ use locally 
            router.push("/api/login"); 
        } catch (error) {
            console.error("Login failed", error);
            window.alert(`Login failed: ${error.message}`);
        }
    };
    
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
                <div className={styles.spotifyrequestContainer}>
                    <Image
                    src="/createplaylist/createplaylistimg-plc.png"
                    className={styles.requestImage}
                    width={1029}
                    height={488}
                    alt="Spotify Auth Image"/>
                <div className={styles.spotifysigninDescriptionContainer}>
                    <div className={styles.headingsContainer}>
                    <h1 className={styles.headings}>Sign into Spotify</h1>
                    </div>
                    <h2 className={styles.headings2}> To use playlist creator please sign into Spotify.
                    </h2>
                </div>         
                <div className={styles.buttonsigninContainer}>
                    <button type="submit" onClick={handleSpotifySignin} className={styles.buttonsignin}>
                        <Image
                        src={SpotifyIcon}
                        className={styles.icon}/>
                        Sign In
                    </button>
                </div>                           
                </div>
            </div>

        </div>
    )
}

export default SpotifyRequest;