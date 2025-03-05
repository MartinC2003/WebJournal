'use client';
import { db } from "@/api/firebase";
import { collection, getDocs } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";
import { UserAuth } from '../../api/AuthContext';
import styles from '../styles/viewentry.module.css';
import BasicDateCalendar from './calendar';
import ViewEntry from './view-entry';

const ViewEntryPage = () => {
  const { user } = UserAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));  
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));  
  const [entryDates, setEntryDates] = useState([]);
  const [entries, setEntries] = useState([]);
  
  useEffect(() => {
    if (!user) return;

    const fetchEntryDates = async () => {
      const dairyEntriesRef = collection(db, "DairyEntries");
      const querySnapshot = await getDocs(dairyEntriesRef);
      const dates = querySnapshot.docs.map(doc => doc.id);
      setEntryDates(dates);
    };

    fetchEntryDates();
  }, [user]);

  useEffect(() => {
    if (!user || !selectedDate) return;

    const fetchEntriesForDate = async () => {
      const selectedDateRef = collection(db, "DairyEntries", selectedDate, "tracks");
      const querySnapshot = await getDocs(selectedDateRef);
      const fetchedEntries = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEntries(fetchedEntries);
    };

    fetchEntriesForDate();
  }, [selectedDate, user]);



  useEffect(() => {
    console.log("Selected Date:", selectedDate); // Full date (YYYY-MM-DD)
    console.log("Selected Month:", selectedMonth); // Month (YYYY-MM)
    console.log("Entry Dates:", entryDates); // All the entry dates fetched from Firestore
  }, [selectedDate, selectedMonth, entryDates]);

  if (!user) {
    return <div>Please log in to view an entry.</div>;
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    const month = date.slice(0, 7);  
    setSelectedMonth(month);
  };

  return (
    <div className={styles.app}>
      <div className={styles.pagecontentContainer}>
        <div className={styles.titleContainer}>
          <Image src="/viewentry/viewentries-title.png" className={styles.titleImage} width={1188} height={211} alt="Entry Title" />
        </div>
        <div className={styles.viewentryContainer}>
          <div className={styles.calendar}>
            <BasicDateCalendar 
              onDateSelect={handleDateSelect} 
              selectedDate={selectedDate} 
              markedDates={entryDates} 
            />
          </div>
          <ViewEntry selectedDate={selectedDate}  selectedMonth={selectedMonth}  entries={entries} />
        </div>
      </div>
    </div>
  );
};

export default ViewEntryPage;