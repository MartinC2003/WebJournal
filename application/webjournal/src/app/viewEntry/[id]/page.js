'use client';
import { doc, getDoc } from 'firebase/firestore';
import Image from "next/image";
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { db } from '../../../api/firebase';
import styles from '../../styles/viewentry.module.css';

const ViewEntry = () => {
  const { id } = useParams();
  const [entry, setEntry] = useState(null);
  const [mood, setMood] = useState("Happy");
  const [tracks, setTracks] = useState([]);

  const moodImages = {
    "Happy": "/createplaylist/happy-albumcv-plc.png",
    "Sad": "/createplaylist/sad-albumcv-plc.png",
    "Angry": "/createplaylist/angry-albumcv-plc.png",
    "Scared": "/createplaylist/scared-albumcv-plc.png",
    "Disgusted": "/createplaylist/disgusted-albumcv-plc.png"
  };

  useEffect(() => {
    const fetchEntry = async () => {
      if (id) {
        console.log('Fetching entry with ID:', id);
        const entryRef = doc(db, 'DairyEntries', id);
        const entrySnapshot = await getDoc(entryRef);
  
        if (entrySnapshot.exists()) {
          const entryData = entrySnapshot.data();
          setEntry({ id: entrySnapshot.id, ...entryData });
          setMood(entryData.mood);
  
          setTracks(entryData.tracks || []);
  
          console.log('Tracks Data:', entryData.tracks);
        } else {
          console.error('No such entry!');
        }
      }
    };
  
    fetchEntry();
  }, [id]);
  

  useEffect(() => {
    console.log('Tracks State:', tracks);
  }, [tracks]);

  if (!entry) return <div>Loading...</div>;

  return (
    <div className={styles.app}>
      <div className={styles.pagecontentContainer}>
        <div className={styles.flexContainer}>
          <div className={styles.moodImageContainer}>
            <Image
                src={moodImages[mood]}
                className={styles.moodImage}
                width={600}
                height={600}
                alt={`${mood} mood cover`}
            />
          </div>
          <div className={styles.entryContainer}>
            <h1>{entry.title}</h1>
            <p>Date: {entry.date}</p>
            <p>Mood: {entry.mood}</p>
            <p>{entry.text}</p>

            {tracks.length > 0 ? (
              <div>
                <h2>Tracks</h2>
                {tracks.map((track, index) => (
                  <div key={index}>
                    <h3>{track.trackTitle}</h3>
                    <p>{track.artist}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No tracks available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEntry;
