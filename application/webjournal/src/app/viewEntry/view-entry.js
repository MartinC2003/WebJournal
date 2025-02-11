// src/app/viewEntry/view-entry.js
'use client';

import { UserAuth } from '@/api/AuthContext';
import { db } from '@/api/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from '../styles/viewentry.module.css';

function ViewEntry({ selectedDate }) {
  const { user } = UserAuth();
  const [entries, setEntries] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const fetchEntries = async () => {
        try {
          const entriesCollection = collection(db, 'DairyEntries');
          const userEntriesQuery = query(
            entriesCollection,
            where('userUid', '==', user.uid)
          );
          const entriesSnapshot = await getDocs(userEntriesQuery);

          const entriesData = [];
          entriesSnapshot.forEach((doc) => {
            entriesData.push({ id: doc.id, ...doc.data() });
          });

          setEntries(entriesData);
        } catch (error) {
          console.error('Error fetching entries:', error);
        }
      };

      fetchEntries();
    }
  }, [user]);

  const handleViewMore = (id) => {
    router.push(`/viewEntry/${id}`);
  };


  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const filteredEntries = selectedDate
    ? entries.filter(entry => entry.date === selectedDate)
    : entries;

  return (
    <div className={styles.entriesContainer}>
      {filteredEntries.map((entry) => (
        <div key={entry.id} className={styles.entryCard}>
          <div className={styles.entrycardContent}>
            <Image 
            src="/viewentry/viewentryimg-plc.png"
            className={styles.entryImage}
            width={200}
            height={411}
            alt="Entry Title"
            />
            <div className={styles.entrycardContent2}>
              <div className={styles.entrycardContentDate}>
                <Image 
                src="/icons/VeIcon.svg"
                className={styles.entryImage}
                width={20}
                height={20}
                alt="Entry Title"
                />
                <p className={styles.entryDate}>{formatDate(entry.date)}</p>
                <Image 
                src="/icons/VeIcon.svg"
                className={styles.entryImage}
                width={20}
                height={20}
                alt="Entry Title"
                />
              </div>
              <h2 className={styles.entryName}> {entry.title}</h2>
            </div>
            <div className={styles.entrycardContent3}>
              <button
                onClick={() => handleViewMore(entry.id)}
                className={styles.button}
              >
                View More
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ViewEntry;
