'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../api/firebase';

const ViewEntry = () => {
  const { id } = useParams(); 
  const [entry, setEntry] = useState(null);

  useEffect(() => {
    const fetchEntry = async () => {
      if (id) {
        console.log('ID:', id); 
        const entryRef = doc(db, 'DairyEntries', id);
        const entrySnapshot = await getDoc(entryRef);
        if (entrySnapshot.exists()) {
          setEntry({ id: entrySnapshot.id, ...entrySnapshot.data() });
        } else {
          console.error('No such entry!');
        }
      }
    };

    fetchEntry();
  }, [id]);

  if (!entry) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>{entry.title}</h1>
      <p>Date: {entry.date}</p>
      <p>Mood: {entry.mood}</p>
      <p>{entry.text}</p>
    </div>
  );
};

export default ViewEntry;
