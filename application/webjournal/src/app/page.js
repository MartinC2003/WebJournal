'use client';
import { UserAuth } from '@/api/AuthContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import styles from '../app/styles/home.module.css';

export default function Home() {
  const { user } = UserAuth();
  const router = useRouter();

  const handleSignUp = () => {
    router.push('/signUp');
  };

  const handleCreateEntry = () => {
    router.push('/createEntry')
  }

  const handleViewEntry = () => {
    router.push('/viewEntry')
  }
  
  const handleCreatePlaylist = () => {
    router.push('/createPlayList')
  }
  useEffect(() => {
    console.log("User:", user);
  }, [user]);

  return (
    <div className={styles.app}>
      {!user ? (
        <div className={styles.welcomeContainer}>
          <div className={styles.imageContainer}>
            <Image
              src='/login/homescreenimg-plc.jpg'
              alt="homescreen placeholder"
              className={styles.image}
              width={736}
              height={483}
            />
          <div className={styles.imageDescriptionContainer}>
            <h2 className={styles.descriptionText}>
                Where Your Stories Find Their Soundtrack
            </h2>
          </div>
          </div>
          <div className={styles.AboutContainer}>
            <h2 className={styles.AboutTitle}>
              Welcome to MusicJournal!
            </h2>
            <p className={styles.AboutContent}>
              Capture your thoughts and create the perfect soundtrack for every mood.
              Reflect on memorable days, work through feelings, or jot down daily experiences,
              all enhanced with personalized playlists. Revisit your entries and relive moments
              with music that captures your emotions. Dive into a seamless blend of journaling
              and music—your stories deserve a soundtrack.
            </p>
            <h2 className={styles.AboutTitle}>
              Are you new here?
            </h2>
            <div className={styles.infoButton2}>
              <button className={styles.signUpButton} onClick={handleSignUp}>
                Sign Up Now
              </button>        
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.homeContainer}>
          <div className={styles.homeContentContainer}>
            <div className={styles.titleContainer}>
              <Image
                src='/homepage/homescreen-title.png'
                alt="homescreen title"
                className={styles.image}
                width={1188}
                height={211}
              />   
            </div>
            <div className={styles.flexContainer}>
              <div className={styles.homeImageContainer}>
                <Image
                    src='/homepage/homescreenimg-plc2.png'
                    alt="homescreen placeholder 2"
                    className={styles.image}
                    width={736}
                    height={856}
                />              
              </div>
              <div className={styles.infoContainer}>
                <div className={styles.createEntryInfoContainer}>
                  <div className={styles.infoContent}>
                    <h2 className={styles.AboutTitle}>
                      Create an Entry!
                    </h2>
                    <p className={styles.AboutContent}>
                      Start capturing your thoughts and feelings.
                      Create new journal entries to document your experiences and emotions.
                      Your stories deserve to be told.
                    </p>
                  </div>
                  <div className={styles.infoButton}>
                    <button className={styles.button} onClick={handleCreateEntry}>
                      Create Entry 
                    </button>
                  </div>
                </div>
                <div className={styles.viewEntryInfoContainer}>
                  <div className={styles.infoContent}>
                    <h2 className={styles.AboutTitle}>
                      View Entries!
                    </h2>
                    <p className={styles.AboutContent}>
                      Explore your past entries and relive your experiences.
                      Reflect on your journey and see how far you've come.
                    </p>
                  </div>
                  <div className={styles.infoButton}>
                    <button className={styles.button} onClick={handleViewEntry}>
                      View Entry
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.flexContainer2}>
              <div className={styles.infoContainer}>
                <div className={styles.createPlaylistInfoContainer}>
                  <div className={styles.infoContent}>
                      <h2 className={styles.AboutTitle}>
                        Create Playlists!
                      </h2>
                      <p className={styles.AboutContent}>
                      Create personalized playlists based on your journal entries. 
                      Let your moods shape the soundtrack of your life, turning your reflections and 
                      emotions into a unique musical journey. Discover how your stories and feelings can 
                      inspire the perfect playlist for any moment.
                      </p>
                  </div>
                  <div className={styles.infoButton}>
                    <button className={styles.button} onClick={handleCreatePlaylist}>
                      Create a Playlist
                    </button>
                  </div>
              </div>            
              </div>
              <div className={styles.homeImageContainer2}>
                <Image
                      src='/homepage/homescreenimg-plc3.png'
                      alt="homescreen placeholder 3"
                      className={styles.image}
                      width={736}
                      height={483}
                />      
              </div>
            </div>          
          </div>
        </div>
      )}
    </div>
  );
}
