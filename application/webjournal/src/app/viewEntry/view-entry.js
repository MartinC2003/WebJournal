// src/app/viewEntry/view-entry.js
'use client';

import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { UserAuth } from '@/api/AuthContext';
import { db } from '@/api/firebase';
import { useRouter } from 'next/navigation';  

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

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'DairyEntries', id));
      console.log('Entry deleted successfully!');
      setEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== id));
    } catch (error) {
      console.error('Error deleting entry:', error);
      window.alert(`Error deleting entry: ${error.message}`);
    }
  };

  const handleViewMore = (id) => {
    router.push(`/viewEntry/${id}`);
  };
  
  

  const filteredEntries = selectedDate
    ? entries.filter(entry => entry.date === selectedDate)
    : entries;

  return (
    <div>
      <div style={{ margin: 'auto' }}>
        {filteredEntries.map((entry) => (
          <div key={entry.id} style={{ background: '#08065a', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', border: '1px solid #ccc', padding: '10px', marginBottom: '20px', position: 'relative', display: 'flex', borderRadius: '10px' }}>
            {entry.mood === 'Sad' && <img src="/sad.gif" alt="Sad" style={{ marginRight: '10px', width: '100px', height: '100px' }} />}
            {entry.mood === 'Happy' && <img src="/happy.gif" alt="Happy" style={{ marginRight: '10px', width: '100px', height: '100px' }} />}
            {entry.mood === 'Angry' && <img src="/angry.gif" alt="Angry" style={{ marginRight: '10px', width: '100px', height: '100px' }} />}
            {entry.mood === 'Neutral' && <img src="/neutral.gif" alt="Neutral" style={{ marginRight: '10px', width: '100px', height: '100px' }} />}
            {entry.mood === 'Annoyed' && <img src="/annoyed.gif" alt="Annoyed" style={{ marginRight: '10px', width: '100px', height: '100px' }} />}
            {entry.mood === 'Bored' && <img src="/bored.gif" alt="Bored" style={{ marginRight: '10px', width: '100px', height: '100px' }} />}
            {entry.mood === 'Scared' && <img src="/scared.gif" alt="Scared" style={{ marginRight: '10px', width: '100px', height: '100px' }} />}

            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '20px' }}>{entry.title}</h2>
              <p>Date: {entry.date}</p>
              <p>Entry: {entry.text}</p>
            </div>
            <button
              onClick={() => handleDelete(entry.id)}
              style={{
                marginLeft: 'auto',
                padding: '5px 10px',
                alignSelf: 'end',
                borderRadius: '5px',
                backgroundColor: 'transparent',
                border: '1px solid ',
                cursor: 'pointer',
              }}
            >
              Delete
            </button>
            <button
              onClick={() => handleViewMore(entry.id)}
              style={{
                marginLeft: '10px',
                padding: '5px 10px',
                alignSelf: 'end',
                borderRadius: '5px',
                backgroundColor: 'transparent',
                border: '1px solid ',
                cursor: 'pointer',
              }}
            >
              View More
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ViewEntry;
