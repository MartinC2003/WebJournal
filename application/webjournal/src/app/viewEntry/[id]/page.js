'use client';
import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import Image from "next/image";
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { db } from '../../../api/firebase';
import styles from '../../styles/viewentry.module.css';

const ViewEntry = () => {
  const { id } = useParams();
  const router = useRouter();
  const [entry, setEntry] = useState(null);
  const [mood, setMood] = useState("Happy");
  const [tracks, setTracks] = useState([]);

  const moodImages = {
    "Happy": "/viewentry/happy-entryimg-plc.png",
    "Sad": "/viewentry/sad-entryimg-plc.png",
    "Angry": "/viewentry/angry-entryimg-plc.png",
    "Scared": "/viewentry/scared-entryimg-plc.png",
    "Disgusted": "/viewentry/disgusted-entryimg-plc.png"
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';

    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const [year, month, day] = dateString.split('-');
    const monthName = months[parseInt(month, 10) - 1];

    return `${monthName} ${parseInt(day, 10)}, ${year}`;
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
        } else {
          console.error('No such entry!');
        }
      }
    };

    fetchEntry();
  }, [id]);

  const handleDeleteEntry = async () => {
    if (!id) return;
    const confirmDelete = window.confirm("Are you sure you want to delete this entry?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, 'DairyEntries', id));
      console.log("Entry deleted successfully.");
      router.push('/viewEntry');
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  if (!entry) return <div>Loading...</div>;

  return (
    <div className={styles.app}>
      <div className={styles.pagecontentContainer}>
        <div className={styles.viewEntryContentContainer}>
          <div className={styles.moodImageContainer}>
            <Image
              src={moodImages[mood]}
              className={styles.moodImage}
              width={544}
              height={856}
              alt={`${mood} mood cover`}
            />
          </div>
          <div className={styles.entryContainer}>
            <div className={styles.entryTitleContainer}>
              <h1 className={styles.entryNameview}>{entry.title}</h1>
            </div>
            <div className={styles.entryContainer2}>
              <div className={styles.entryDateContainer}>
                <p className={styles.entryDateView}>{formatDate(entry.date)}</p>
              </div>
              <div className={styles.entryTextContainer}>
                <p className={styles.entryTextView}>{entry.text}</p>
              </div>
            </div>
            {tracks.length > 0 && (
              <div className={styles.trackContentContainer}>
                <p className={styles.entryDateView}>Tracks I was Listening to</p>
                {tracks.map((track, index) => (
                  <div key={index} className={styles.trackContainer}>
                    <Image
                      src="/icons/TrackIcon.svg"
                      className={styles.trackIcon}
                      width={20}
                      height={20}
                      alt="Entry Title"
                    />
                    <div className={styles.trackContainer2}>
                      <h3 className={styles.trackTitle}>{track.trackTitle}</h3>
                      <p className={styles.trackArtist}>{track.artist}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className={styles.deleteButtonContainer}>
              <button className={styles.deleteButton} onClick={handleDeleteEntry}>
                Delete Entry
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEntry;
