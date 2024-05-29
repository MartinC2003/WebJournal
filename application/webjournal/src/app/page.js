'use client'
import React, { useEffect } from 'react';
import { UserAuth } from '@/api/AuthContext';
import { useRouter } from 'next/navigation';
import styles from '../app/styles/home.module.css';
import Image from 'next/image'; 

export default function Home() {
  
  const { user } = UserAuth();
  const router = useRouter();
  const handleSignUp = () => {
    router.push('/signUp');  
  };

  const handleLogin = () => {
    router.push('/logIn');  
  };


  useEffect(() => {
    console.log("User:", user);
  }, [user]);

  return (
    <div className={styles.app}>
      {!user ? (
      <div className={styles.app}>
        <div className={styles.welcomeContainer}>
          <div className={styles.imageContainer}>
            <Image 
              src='/login/homescreenimg-plc.jpg' 
              alt="Description of the image" 
              className={styles.image} 
              width={736} 
              height={483}
            />
            <h2 className={styles.descriptionText}>
              Where Your Stories Find Their Soundtrack
            </h2>
          </div>
          <div className={styles.AboutContainer}>
            <h2 className={styles.AboutTitle}>
              Welcome to MusicJournal! 
            </h2>
            <p className={styles.AboutContent}>Capture your thoughts and create the perfect soundtrack for every mood. 
              Reflect on memorable days, work through feelings, or jot down daily experiences, 
              all enhanced with personalized playlists. Revisit your entries and relive moments 
              with music that captures your emotions. Dive into a seamless blend of journaling 
              and music—your stories deserve a soundtrack.
            </p>
            <h2 className={styles.AboutTitle}>
              Are you new here?
            </h2>
            <button className={styles.button} onClick={handleSignUp}>Sign Up Now</button>
          </div>
        </div>
    </div>

      ) : (
        <div className={styles.welcomeContainer}>
          {/* Content for logged in user */}
        </div>
      )}
    </div>
  );
}
