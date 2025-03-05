'use client';

import { db } from "@/api/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
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
  const [selectedDates, setSelectedDates] = useState([]);
  const [entries, setEntries] = useState([]);
  const [mode, setMode] = useState('date');

  useEffect(() => {
    if (!user) return;

    console.log("Fetching entries - Mode:", mode);
    console.log("Selected Date:", selectedDate);
    console.log("Selected Month:", selectedMonth);

    const fetchEntries = async () => {
      let entriesToFetch = [];

      if (mode === 'date') {
        console.log("Fetching entries for date:", selectedDate);
        const selectedDateRef = collection(db, "DairyEntries");
        const querySnapshot = await getDocs(selectedDateRef);
        entriesToFetch = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(entry => entry.date === selectedDate);
      } else if (mode === 'month') {
        console.log("Fetching entries for month:", selectedMonth);
        const { startDate, endDate } = getMonthStartAndEnd(selectedMonth);
        console.log("Month Start Date:", startDate);
        console.log("Month End Date:", endDate);

        const dairyEntriesRef = collection(db, "DairyEntries");
        const q = query(
          dairyEntriesRef,
          where("date", ">=", startDate),
          where("date", "<=", endDate)
        );
        
        const querySnapshot = await getDocs(q);
        entriesToFetch = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }

      console.log("Fetched Entries:", entriesToFetch);
      setEntries(entriesToFetch);

      if (mode === 'month') {
        const { startDate, endDate } = getMonthStartAndEnd(selectedMonth);
        const filteredEntries = entriesToFetch.filter(entry => {
          const entryDate = new Date(entry.date);
          return entryDate >= new Date(startDate) && entryDate <= new Date(endDate);
        });
        console.log("Filtered Entries for Month:", filteredEntries);
        setSelectedDates(filteredEntries);
      }
    };

    fetchEntries();
  }, [selectedDate, selectedMonth, user, mode]);

  const getMonthStartAndEnd = (month) => {
    const [year, monthIndex] = month.split("-");
    const startDate = new Date(year, monthIndex - 1, 1);
    const endDate = new Date(year, monthIndex, 0);

    return {
      startDate: startDate.toISOString().slice(0, 10),
      endDate: endDate.toISOString().slice(0, 10),
    };
  };

  const handleDateSelect = (date) => {
    console.log("Date Selected:", date);
    setSelectedDate(date);
  
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0"); // Ensure two-digit format
    const formattedMonth = `${year}-${month}`;
  
    console.log("Updated Selected Month:", formattedMonth);
    setSelectedMonth(formattedMonth);
  };
  

  

  if (!user) {
    return <div>Please log in to view an entry.</div>;
  }

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
              setMode={setMode}
              mode={mode}
            />
          </div>
          <ViewEntry selectedDates={selectedDates} entries={entries} />
        </div>
      </div>
    </div>
  );
};

export default ViewEntryPage;
