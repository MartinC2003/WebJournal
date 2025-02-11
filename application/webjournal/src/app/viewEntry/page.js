'use client';
import Image from "next/image";
import { useState } from "react";
import { UserAuth } from '../../api/AuthContext';
import styles from '../styles/viewentry.module.css';
import BasicDateCalendar from './calendar';
import ViewEntry from './view-entry';

const ViewEntryPage = () => {
  const { user } = UserAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));

  if (!user) {
    return (
      <div >
        <p>Please log in to view an entry.</p>
      </div>
    );
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className={styles.app}>
      <div className={styles.pagecontentContainer}>
        <div className={styles.titleContainer}>
          <Image 
            src="/viewentry/viewentries-title.png"
            className={styles.titleImage}
            width={1188}
            height={211}
            alt="Entry Title"
          />
        </div>
        <div className={styles.viewentryContainer}>
          <div className={styles.calendar}>
            <BasicDateCalendar onDateSelect={handleDateSelect} />
          </div>
          <div >
            <ViewEntry selectedDate={selectedDate} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewEntryPage;
